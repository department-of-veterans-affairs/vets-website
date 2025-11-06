const ERROR_ATTR_SELECTORS = [
  'error',
  'input-error',
  'checkbox-error',
  'generated-error',
];

const INPUT_SELECTOR = 'input, select, textarea';
const ERROR_SPAN_SELECTOR = 'span.usa-sr-only[id^="error-label-"]';
const GROUP_COMPONENT_TAGS = ['VA-RADIO', 'VA-CHECKBOX-GROUP'];
const GROUP_OPTION_SELECTOR = 'va-radio-option, va-checkbox';

const generatedErrorIdCache = new Map();

const getErrorCacheKey = (element, errorLabelText) => {
  if (!element) return errorLabelText;

  const identifier =
    element.getAttribute('data-error-cache-key') ||
    element.getAttribute('data-testid') ||
    element.getAttribute('name') ||
    element.getAttribute('id') ||
    element.getAttribute('label') ||
    element.getAttribute('aria-label') ||
    element.tagName?.toLowerCase();

  let indexSuffix = '';
  if (typeof document !== 'undefined' && element.tagName) {
    const tagName = element.tagName.toLowerCase();
    const peers = Array.from(document.querySelectorAll(tagName));
    const position = peers.indexOf(element);
    if (position >= 0) {
      indexSuffix = `#${position}`;
    }
  }

  return `${identifier || 'component'}${indexSuffix}|${errorLabelText}`;
};

const isGroupComponent = element =>
  !!element && GROUP_COMPONENT_TAGS.includes(element.tagName);

const getGroupOptions = element =>
  element ? Array.from(element.querySelectorAll(GROUP_OPTION_SELECTOR)) : [];

const syncGroupGeneratedErrors = (groupElement, errorMessage) => {
  if (!isGroupComponent(groupElement)) return;

  const options = getGroupOptions(groupElement);
  options.forEach(option => {
    if (errorMessage) {
      option.setAttribute('generated-error', errorMessage);
    } else {
      option.removeAttribute('generated-error');
    }
  });
};

const findGroupOptionFocusTarget = option => {
  if (!option) return null;

  const shadowInput = option.shadowRoot?.querySelector(INPUT_SELECTOR);
  if (shadowInput) {
    return shadowInput;
  }

  return option.querySelector(INPUT_SELECTOR) || null;
};

const getErrorPropText = el => {
  for (const attr of ERROR_ATTR_SELECTORS) {
    const msg = el.getAttribute(attr);
    if (msg) return msg;
  }
  return el.error || '';
};

const collectAllErrorElements = selectors => {
  const allErrorElements = document.querySelectorAll(selectors);
  const nestedErrorElements = [];

  allErrorElements.forEach(el => {
    const nestedErrors = Array.from(
      el.shadowRoot?.querySelectorAll('*') || [],
    ).filter(child => {
      return (
        child.tagName.toLowerCase().startsWith('va-') && getErrorPropText(child)
      );
    });

    if (nestedErrors.length) {
      nestedErrorElements.push(...nestedErrors);
    }
  });

  return [...allErrorElements, ...nestedErrorElements];
};

const getLabelText = el => {
  let labelText = el.getAttribute('label') || el.label || '';

  if (!labelText) {
    labelText = el.getAttribute('input-label') || el.inputLabel || '';
  }

  if (!labelText) {
    const labelElement = el.shadowRoot?.querySelector('label');
    labelText = labelElement?.textContent?.trim() || '';
  }

  return labelText;
};

const removeAlertRole = el => {
  const errorElement = el?.shadowRoot?.querySelector(
    '#input-error-message, #radio-error-message, #checkbox-error-message',
  );
  if (errorElement) {
    errorElement.removeAttribute('role');
    errorElement.removeAttribute('aria-live');
  }
};

const findFocusTarget = el => {
  let focusTarget;

  if (isGroupComponent(el)) {
    const options = getGroupOptions(el);
    for (const option of options) {
      const optionTarget = findGroupOptionFocusTarget(option);
      if (optionTarget) {
        return optionTarget;
      }
    }
  }

  let childWithError = null;
  if (el.shadowRoot) {
    childWithError = el.shadowRoot.querySelector('[error]:not([error=""])');
  }
  if (childWithError) {
    return findFocusTarget(childWithError);
  }

  if (el.shadowRoot) {
    focusTarget = el.shadowRoot.querySelector(INPUT_SELECTOR);
    if (focusTarget) return focusTarget;
  }

  if (el.shadowRoot) {
    const nestedComponents = Array.from(
      el.shadowRoot.querySelectorAll('*'),
    ).filter(child => child.tagName?.toLowerCase().startsWith('va-'));
    for (const nestedComponent of nestedComponents) {
      const nestedFocusTarget = findFocusTarget(nestedComponent);
      if (nestedFocusTarget && nestedFocusTarget !== nestedComponent) {
        return nestedFocusTarget;
      }
    }
  }

  if (el.shadowRoot) {
    focusTarget = el.shadowRoot.querySelector('[tabindex], button, a[href]');
    if (focusTarget) return focusTarget;
  }

  return el;
};

function hasErrorAnnotation(element) {
  if (!element) return false;

  if (element.shadowRoot?.querySelector(ERROR_SPAN_SELECTOR)) {
    return true;
  }

  const focusTarget = findFocusTarget(element);
  if (!focusTarget) return false;

  const labelledBy = focusTarget.getAttribute('aria-labelledby');
  if (!labelledBy) return false;

  const potentialHosts = [
    element.shadowRoot,
    focusTarget.shadowRoot,
    element,
    focusTarget,
  ].filter(root => root?.querySelector);

  return potentialHosts.some(root => root.querySelector(`#${labelledBy}`));
}

const buildErrorLabelText = (
  errorMessage,
  errorWebComponent,
  includeHintAndDescription = true,
) => {
  const errorText = errorMessage.replace(/^Error\s*/i, '').trim();
  const labelText = getLabelText(errorWebComponent);

  let fullText = `Error: ${errorText}`;
  if (labelText) {
    fullText += `. ${labelText}`;
  }

  if (includeHintAndDescription) {
    const hintElement = errorWebComponent.shadowRoot?.querySelector(
      '.usa-hint',
    );
    const hintText = hintElement?.textContent?.trim() || '';

    const descriptionElement = errorWebComponent.shadowRoot?.querySelector(
      '.usa-checkbox__label-description',
    );
    const descriptionText = descriptionElement?.textContent?.trim() || '';

    if (hintText) {
      fullText += `. ${hintText}`;
    }
    if (descriptionText) {
      fullText += `. ${descriptionText}`;
    }
  }

  return fullText;
};

const createAndAssociateErrorLabel = (input, fullText, hostComponent) => {
  const container = hostComponent?.shadowRoot || hostComponent;
  if (!input || !container?.querySelector) {
    return;
  }

  const hostLabelId = hostComponent.getAttribute(
    'data-generated-error-label-id',
  );
  const inputLabelId = input.getAttribute('aria-labelledby');
  const existingSpan = container.querySelector(ERROR_SPAN_SELECTOR);
  const cacheKey = getErrorCacheKey(hostComponent, fullText);

  let labelId =
    hostLabelId ||
    inputLabelId ||
    generatedErrorIdCache.get(cacheKey) ||
    existingSpan?.id ||
    '';
  let labelSpan = labelId ? container.querySelector(`#${labelId}`) : null;

  if (!labelSpan) {
    labelSpan = document.createElement('span');
    labelSpan.id =
      labelId ||
      `error-label-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
    labelSpan.className = 'usa-sr-only';
    container.appendChild(labelSpan);
    labelId = labelSpan.id;
  }

  labelSpan.textContent = fullText;

  input.setAttribute('aria-labelledby', labelId);
  hostComponent.setAttribute('data-generated-error-label-id', labelId);
  input.removeAttribute('aria-describedby');

  if (cacheKey) {
    generatedErrorIdCache.set(cacheKey, labelId);
  }
};

const associateErrorWithInput = (errorWebComponent, errorMessage) => {
  if (isGroupComponent(errorWebComponent)) {
    syncGroupGeneratedErrors(errorWebComponent, errorMessage);
  }

  const inputElement = findFocusTarget(errorWebComponent);
  if (!inputElement) return;

  const fullText = buildErrorLabelText(errorMessage, errorWebComponent, true);

  if (errorWebComponent.shadowRoot) {
    createAndAssociateErrorLabel(inputElement, fullText, errorWebComponent);
  }
};

const addErrorAnnotations = errorWebComponent => {
  removeAlertRole(errorWebComponent);

  const errorMessage = getErrorPropText(errorWebComponent);
  if (!errorMessage) return;

  associateErrorWithInput(errorWebComponent, errorMessage);
};

const removeErrorAnnotations = el => {
  if (isGroupComponent(el)) {
    syncGroupGeneratedErrors(el, null);
  }

  const container = el.shadowRoot || el;
  if (!container?.querySelector) return;

  const labelId = el.getAttribute('data-generated-error-label-id');

  container.querySelectorAll(INPUT_SELECTOR).forEach(input => {
    const ariaId = input.getAttribute('aria-labelledby');
    if (!labelId || ariaId === labelId) {
      input.removeAttribute('aria-labelledby');
    }
  });

  if (labelId) {
    const labelledSpan = container.querySelector(`#${labelId}`);
    labelledSpan?.remove();
  }

  container.querySelectorAll(ERROR_SPAN_SELECTOR).forEach(span => {
    if (!container.querySelector(`[aria-labelledby="${span.id}"]`)) {
      span.remove();
    }
  });

  el.removeAttribute('data-generated-error-label-id');
};

const cleanupNestedShadowRoots = root => {
  if (!root) return;

  let elements = [];

  if (root.querySelectorAll) {
    elements = Array.from(root.querySelectorAll('*'));
  }

  elements.forEach(el => {
    if (!el.tagName.toLowerCase().startsWith('va-')) {
      return;
    }

    const errorMessage = getErrorPropText(el);

    if (!errorMessage) {
      const hasErrorSpan = el.shadowRoot?.querySelector(ERROR_SPAN_SELECTOR);

      if (hasErrorSpan) {
        removeErrorAnnotations(el);
      }
    }

    if (el.shadowRoot) {
      cleanupNestedShadowRoots(el.shadowRoot);
    }
  });
};

const cleanupErrorAnnotations = () => {
  const errorSelector = ERROR_ATTR_SELECTORS.map(attr => `[${attr}]`).join(
    ', ',
  );
  const elementsWithErrors = document.querySelectorAll(errorSelector);
  elementsWithErrors.forEach(el => {
    const currentErrorMessage = getErrorPropText(el);
    const previousErrorMessage = el.dataset.previousErrorMessage || '';
    const hasExistingAnnotation =
      hasErrorAnnotation(el) || (!el.shadowRoot && !isGroupComponent(el));

    if (!currentErrorMessage) {
      removeErrorAnnotations(el);
      if (isGroupComponent(el)) {
        syncGroupGeneratedErrors(el, null);
      }
      // eslint-disable-next-line no-param-reassign
      delete el.dataset.previousErrorMessage;
    } else if (
      previousErrorMessage !== currentErrorMessage ||
      !hasExistingAnnotation
    ) {
      if (
        previousErrorMessage &&
        previousErrorMessage !== currentErrorMessage
      ) {
        el.removeAttribute('data-generated-error-label-id');
      }
      associateErrorWithInput(el, currentErrorMessage);
      if (isGroupComponent(el)) {
        syncGroupGeneratedErrors(el, currentErrorMessage);
      }
      // eslint-disable-next-line no-param-reassign
      el.dataset.previousErrorMessage = currentErrorMessage;
    } else if (isGroupComponent(el)) {
      syncGroupGeneratedErrors(el, currentErrorMessage);
    }
  });

  cleanupNestedShadowRoots(document);
};

export {
  ERROR_ATTR_SELECTORS,
  ERROR_SPAN_SELECTOR,
  addErrorAnnotations,
  cleanupErrorAnnotations,
  collectAllErrorElements,
  findFocusTarget,
  getErrorPropText,
};
