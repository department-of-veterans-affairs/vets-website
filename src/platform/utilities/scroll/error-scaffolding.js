// ============================================================================
// Error Handling Categories
//
// VA form web components expose validation state in three shapes:
//
// CATEGORY 1 – DIRECT ERROR
//   The component itself receives the error attribute and owns the focus target
//   inside its shadow DOM (va-text-input, va-textarea, va-select). We attach the
//   screen reader label directly to that input element.
//
// CATEGORY 2 – CHILD COMPONENT ERROR
//   Composite wrappers delegate errors to their internal VA children (for
//   example va-memorable-date, va-statement-of-truth). The shared helpers discover
//   those children and treat them the same as Category 1 controls.
//
// CATEGORY 3 – GROUP COMPONENT ERROR
//   Group hosts receive the parent error while each option mirrors the message
//   via an alternate attribute (va-radio with va-radio-option, va-checkbox-group
//   with va-checkbox). We propagate labels to every option to avoid repeated
//   announcements when focus moves within the group.
// ============================================================================

// ============================================================================
// Category Detection & Configuration
// ============================================================================
// Default value for the scaffoldAndFocusFormErrors formOption
// If you need to turn this off, set to false in your form config:
// formOptions: {scaffoldAndFocusFormErrors: false}
const DEFAULT_SCAFFOLD_AND_FOCUS_FORM_ERRORS = true;

const ERROR_ATTR_SELECTORS = [
  'error',
  'input-error',
  'checkbox-error',
  'generated-error',
];
const ERROR_ATTRIBUTE_SELECTOR_STRING = ERROR_ATTR_SELECTORS.map(
  attr => `[${attr}]`,
).join(', ');

const HIDDEN_FILTER = ':not([aria-hidden="true"]):not([hidden])';
const INPUT_SELECTOR = `input${HIDDEN_FILTER}, textarea${HIDDEN_FILTER}, select${HIDDEN_FILTER}`;
const ERROR_SPAN_SELECTOR = 'span.usa-sr-only[id^="error-label-"]';
const ERROR_MESSAGE_SELECTORS = [
  '#input-error-message',
  '#radio-error-message',
  '#checkbox-error-message',
];
const GROUP_COMPONENT_TAGS = ['VA-RADIO', 'VA-CHECKBOX-GROUP'];
const GROUP_OPTION_SELECTOR = 'va-radio-option, va-checkbox';
const GROUP_OPTION_TAGS = ['VA-RADIO-OPTION', 'VA-CHECKBOX'];
const GROUP_SELECTOR = GROUP_COMPONENT_TAGS.map(tag => tag.toLowerCase()).join(
  ', ',
);

// ============================================================================
// General helpers
// ============================================================================
/**
 * Determines whether a node is a supported VA design system web component based on its tag name.
 *
 * @param {Element|null|undefined} element - The node to examine
 * @returns {boolean} True when the tag name starts with the `va-` prefix, otherwise false
 */
const isSupportedVaElement = element => {
  if (!element?.tagName) return false;

  // TODO: create a fix that targets all va- components, not just the ones in this list
  const allowedElements = [
    'va-checkbox-group',
    'va-checkbox',
    'va-combo-box',
    'va-file-input',
    'va-file-input-multiple',
    'va-radio',
    'va-radio-option',
    'va-select',
    'va-statement-of-truth',
    'va-text-input',
    'va-textarea',
  ];

  return allowedElements.includes(element.tagName.toLowerCase());
};

/**
 * Collects VA design system elements under the provided root.
 *
 * @param {Element|ShadowRoot|Document|null} root - The root node to scan
 * @returns {HTMLElement[]} Array of descendant VA components, or empty array when none are present
 */
const getVaElements = root => {
  if (!root?.querySelectorAll) {
    return [];
  }

  return Array.from(root.querySelectorAll('*')).filter(isSupportedVaElement);
};

/**
 * Extracts error message text from a DOM element by checking various error attributes and properties.
 * Iterates through predefined error attribute selectors to find the first available error message.
 * Falls back to the element's error property if no attribute contains a message.
 *
 * @param {HTMLElement} el - The DOM element to extract error text from
 * @returns {string} The error message text, or an empty string if no error is found
 */
const getErrorPropText = el => {
  for (const attr of ERROR_ATTR_SELECTORS) {
    const msg = el.getAttribute(attr);
    if (msg) return msg;
  }
  return el.error || '';
};

// ============================================================================
// Category 3: Group Component Helpers
// ============================================================================
/**
 * Checks if an element's tag name matches any in the provided tag list.
 *
 * @param {Element|null|undefined} element - The DOM element to check
 * @param {string[]} tags - Array of uppercase tag names to check against
 * @returns {boolean} True if the element's tag name is in the list, false otherwise
 */
const isComponentOfType = (element, tags) =>
  !!element && tags.includes(element.tagName?.toUpperCase());

/**
 * Determines if an element is a group component based on its tag name.
 * Group components include radio groups and checkbox groups that contain multiple options.
 *
 * @param {Element|null|undefined} element - The DOM element to check
 * @returns {boolean} True if the element exists and its tag name is included in GROUP_COMPONENT_TAGS, false otherwise
 */
const isGroupComponent = element =>
  isComponentOfType(element, GROUP_COMPONENT_TAGS);

/**
 * Determines if an element is a group option component (radio or checkbox option).
 * Group options are individual selectable items within a group component.
 *
 * @param {Element|null|undefined} element - The DOM element to check
 * @returns {boolean} True if the element exists and its tag name is included in GROUP_OPTION_TAGS, false otherwise
 */
const isGroupOptionComponent = element =>
  isComponentOfType(element, GROUP_OPTION_TAGS);

/**
 * Finds the nearest ancestor group component (radio group or checkbox group) for a given element.
 * Used to associate group options with their parent group for error synchronization.
 *
 * @param {Element|null|undefined} element - The DOM element whose group ancestor is searched
 * @returns {Element|null} The closest group host element or null when none is found
 */
const findParentGroupComponent = element =>
  element?.closest ? element.closest(GROUP_SELECTOR) : null;

/**
 * Retrieves all group option elements that are direct descendants of a group component.
 * Returns options that need error state synchronization with their parent group.
 *
 * @param {Element|null|undefined} element - The group component to query
 * @returns {HTMLElement[]} An array of option components associated with the group
 */
const getGroupOptions = element =>
  element ? Array.from(element.querySelectorAll(GROUP_OPTION_SELECTOR)) : [];

/**
 * Finds the focus target input element within a group option element.
 * Searches for input elements in both shadow DOM and regular DOM.
 *
 * @param {HTMLElement} option - The group option element to search within
 * @returns {HTMLElement|null} The input element to focus on, or null if not found
 */
const findGroupOptionFocusTarget = option => {
  if (!option) return null;

  const shadowInput = option.shadowRoot?.querySelector(INPUT_SELECTOR);
  if (shadowInput) {
    return shadowInput;
  }

  return option.querySelector(INPUT_SELECTOR) || null;
};

// ============================================================================
// Category 2: Child Component Helpers
// ============================================================================

/**
 * Collects all error elements from the DOM, including nested elements within shadow roots.
 *
 * @param {string} selectors - CSS selector string to query for error elements
 * @returns {Element[]} Array containing all error elements found, including both top-level
 *                      elements matching the selectors and nested VA web components with
 *                      error properties found within shadow roots
 *
 * @description This function performs a two-step collection process:
 * 1. Queries the document for all elements matching the provided selectors
 * 2. For each found element, searches within its shadow root (if present) for nested
 *    VA web components (elements with tagName starting with 'va-') that have error
 *    properties as determined by getErrorPropText()
 */
const collectAllErrorElements = selectors => {
  const allErrorElements = document.querySelectorAll(selectors);
  const nestedErrorElements = [];

  allErrorElements.forEach(el => {
    const nestedErrors = getVaElements(el.shadowRoot).filter(child =>
      getErrorPropText(child),
    );

    if (nestedErrors.length) {
      nestedErrorElements.push(...nestedErrors);
    }
  });

  return [...allErrorElements, ...nestedErrorElements];
};

/**
 * Extracts label text from a DOM element using multiple fallback strategies.
 *
 * This function attempts to retrieve label text from an element by checking:
 * 1. The 'label' attribute or property
 * 2. The 'input-label' attribute or 'inputLabel' property as fallback
 * 3. Text content from a label element within the element's shadow DOM as final fallback
 *
 * @param {HTMLElement} el - The DOM element to extract label text from
 * @returns {string} The label text found, or an empty string if no label is found
 */
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

/**
 * Resolves the element that should receive focus for a component displaying an error state.
 *
 * The lookup prioritizes:
 * 1. Group option inputs when invoked on a radio or checkbox group
 * 2. Child elements already carrying an error attribute
 * 3. The first native form control within the component's shadow root
 * 4. Nested VA components that expose their own focus targets
 * 5. Any other focusable node within the component
 * 6. Finally the component itself when no better target is found
 *
 * @param {HTMLElement} el - The host web component being evaluated
 * @returns {HTMLElement} The element that should receive focus
 */
const findFocusTarget = el => {
  if (isGroupComponent(el)) {
    const options = getGroupOptions(el);
    for (const option of options) {
      const optionTarget = findGroupOptionFocusTarget(option);
      if (optionTarget) {
        return optionTarget;
      }
    }
  }

  const { shadowRoot } = el;
  if (!shadowRoot) return el;

  // Try direct selectors in order of priority
  const errorSelector = ERROR_ATTR_SELECTORS.map(
    attr => `[${attr}]:not([${attr}=""])`,
  ).join(', ');

  const childWithError = shadowRoot.querySelector(errorSelector);
  if (childWithError) {
    return findFocusTarget(childWithError);
  }

  const focusTarget = shadowRoot.querySelector(INPUT_SELECTOR);
  if (focusTarget) {
    return focusTarget;
  }

  // Check nested VA components
  const nestedComponents = getVaElements(shadowRoot);
  for (const nestedComponent of nestedComponents) {
    const nestedFocusTarget = findFocusTarget(nestedComponent);
    if (nestedFocusTarget && nestedFocusTarget !== nestedComponent) {
      return nestedFocusTarget;
    }
  }

  // Fallback to any focusable element
  const fallbackFocusable = shadowRoot.querySelector(
    '[tabindex], button, a[href]',
  );
  if (fallbackFocusable) {
    return fallbackFocusable;
  }

  return el;
};

/**
 * Determines whether a component already owns a generated error annotation label.
 *
 * @param {HTMLElement|null} element - The component to inspect
 * @returns {boolean} True when an associated error label is detected, otherwise false
 */
function hasErrorAnnotation(element) {
  if (!element) return false;

  if (element.shadowRoot?.querySelector(ERROR_SPAN_SELECTOR)) {
    return true;
  }

  const focusTarget = findFocusTarget(element);
  const labelledBy = focusTarget?.getAttribute('aria-labelledby');
  if (!labelledBy) return false;

  const potentialHosts = [
    element.shadowRoot,
    focusTarget.shadowRoot,
    element,
    focusTarget,
  ].filter(root => root?.querySelector);

  return potentialHosts.some(root => root.querySelector(`#${labelledBy}`));
}

/**
 * Builds the screen reader friendly text used inside generated error labels.
 *
 * @param {string} errorMessage - Raw error message coming from the component
 * @param {HTMLElement} errorWebComponent - The component producing the error
 * @param {HTMLElement|null} [childOption=null] - Optional option element when formatting group errors
 * @returns {string} Fully composed label text containing context, hints, and descriptions
 */
const buildErrorLabelText = (
  errorMessage,
  errorWebComponent,
  childOption = null,
) => {
  const errorText = errorMessage.replace(/^Error\s*/i, '').trim();
  const labelText = getLabelText(errorWebComponent);

  let fullText = `Error: ${errorText}`;
  if (labelText) {
    fullText += `. ${labelText}`;
  }

  if (childOption) {
    const childLabelText = getLabelText(childOption);
    if (childLabelText) {
      fullText += `. ${childLabelText}`;
    }
  }

  const hintElement = errorWebComponent.shadowRoot?.querySelector('.usa-hint');
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

  return fullText;
};

/**
 * Creates and associates an error label with an input element for accessibility purposes.
 * This function generates or reuses existing error labels and sets appropriate ARIA attributes.
 *
 * @param {HTMLElement} input - The input element that needs an error label
 * @param {string} fullText - The error message text to display in the label
 * @param {HTMLElement} hostComponent - The host component element that contains the input
 * @returns {void}
 *
 * @description
 * - Finds the appropriate container (shadow root or host component)
 * - Reuses existing error labels when possible or creates new ones
 * - Sets aria-labelledby attribute on the input element
 * - Removes aria-describedby attribute to avoid conflicts
 * - Ensures proper DOM structure and accessibility compliance
 */
const createAndAssociateErrorLabel = (input, fullText, hostComponent) => {
  if (!input) return;

  // Find the container where the error label should be created
  const container =
    hostComponent?.shadowRoot || hostComponent || input.parentElement;

  if (!container?.appendChild || !container.querySelector) {
    return;
  }

  const hostLabelId = hostComponent?.getAttribute?.(
    'data-generated-error-label-id',
  );
  const inputLabelId = input.getAttribute('aria-labelledby');

  let labelId = hostLabelId || inputLabelId || '';
  let labelSpan = labelId ? container.querySelector(`#${labelId}`) : null;

  if (!labelSpan) {
    const existingSpan = container.querySelector(ERROR_SPAN_SELECTOR);
    if (existingSpan) {
      labelSpan = existingSpan;
      labelId = existingSpan.id;
    }
  }

  if (!labelSpan) {
    const ownerDocument = container.ownerDocument || document;
    labelSpan = ownerDocument.createElement('span');
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
  if (hostComponent?.setAttribute) {
    hostComponent.setAttribute('data-generated-error-label-id', labelId);
  }
  input.removeAttribute('aria-describedby');
};

// ============================================================================
// Category 3: Group Error Helpers
// ============================================================================

/**
 * Synchronizes the `generated-error` attribute on every option within a group component.
 * When an error message is provided, the message is mirrored to all options. If the
 * message is empty, the helper removes stale attributes instead.
 *
 * @param {HTMLElement} groupElement - The radio or checkbox group host element
 * @param {string|null} errorMessage - Error text to apply or null/undefined to clear
 * @returns {HTMLElement[]} The option elements that were inspected during synchronization
 */
function syncGroupGeneratedErrors(groupElement, errorMessage) {
  if (!isGroupComponent(groupElement)) return [];

  const options = getGroupOptions(groupElement);
  options.forEach(option => {
    const currentMessage = option.getAttribute('generated-error') || '';

    if (errorMessage) {
      if (currentMessage !== errorMessage) {
        option.setAttribute('generated-error', errorMessage);
      }
      return;
    }

    if (currentMessage) {
      option.removeAttribute('generated-error');
    }
  });

  return options;
}

/**
 * Generates error annotations for every option contained in a group component.
 *
 * @param {HTMLElement} groupComponent - The group component emitting an error
 * @param {string|null} errorMessage - Message to associate with each option
 * @returns {void}
 */
function associateGroupErrorAnnotations(groupComponent, errorMessage) {
  if (!errorMessage) {
    syncGroupGeneratedErrors(groupComponent, null);
    return;
  }

  const options = syncGroupGeneratedErrors(groupComponent, errorMessage);
  options.forEach(option => {
    const optionInput = findGroupOptionFocusTarget(option);
    if (!optionInput) return;

    const optionText = buildErrorLabelText(
      errorMessage,
      groupComponent,
      option,
    );

    createAndAssociateErrorLabel(optionInput, optionText, option);
  });
}

/**
 * Removes all generated error-related attributes and nodes from a host component.
 *
 * @param {HTMLElement|null} hostComponent - The component whose annotations should be cleared
 * @returns {void}
 */
const clearHostErrorAnnotations = hostComponent => {
  if (!hostComponent) return;

  const container = hostComponent.shadowRoot || hostComponent;
  if (!container?.querySelector) return;

  const labelId = hostComponent.getAttribute('data-generated-error-label-id');

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
    const isReferenced = container.querySelector(
      `[aria-labelledby="${span.id}"]`,
    );
    if (!isReferenced) {
      span.remove();
    }
  });

  hostComponent.removeAttribute('data-generated-error-label-id');
};

/**
 * Clears cached error state for every option belonging to the supplied group component.
 *
 * @param {HTMLElement} groupComponent - Radio or checkbox group to clear
 * @returns {void}
 */
function clearGroupOptionAnnotations(groupComponent) {
  const options = syncGroupGeneratedErrors(groupComponent, null);
  options.forEach(option => {
    clearHostErrorAnnotations(option);
    option.removeAttribute('data-previous-error-message');
  });
}

/**
 * Associates error messages with input elements, handling both group components and individual inputs.
 * For group components, creates error labels for each option within the group.
 * For individual inputs, creates a single error label associated with the input element.
 *
 * @param {HTMLElement} errorWebComponent - The web component that contains the error
 * @param {string} errorMessage - The error message to display and associate with inputs
 * @returns {void}
 */
const associateErrorWithInput = (errorWebComponent, errorMessage) => {
  if (isGroupComponent(errorWebComponent)) {
    associateGroupErrorAnnotations(errorWebComponent, errorMessage);
    return;
  }

  const inputElement = findFocusTarget(errorWebComponent);
  if (!inputElement) return;

  const fullText = buildErrorLabelText(errorMessage, errorWebComponent);

  if (errorWebComponent.shadowRoot) {
    createAndAssociateErrorLabel(inputElement, fullText, errorWebComponent);
  }
};

/**
 * Adds error annotations to a web component by removing alert roles and associating error messages with inputs.
 * @param {HTMLElement} errorWebComponent - The web component element that contains or represents an error state
 * @returns {void} This function does not return a value
 */
const addErrorAnnotations = errorWebComponent => {
  // Skip elements not in the allowedElements list
  if (!isSupportedVaElement(errorWebComponent)) return;

  // Remove alert role from error message elements to prevent duplicate announcements
  const errorElement = errorWebComponent?.shadowRoot?.querySelector(
    ERROR_MESSAGE_SELECTORS.join(', '),
  );
  if (errorElement) {
    errorElement.removeAttribute('role');
    errorElement.removeAttribute('aria-live');
  }

  const errorMessage = getErrorPropText(errorWebComponent);
  if (!errorMessage) return;

  associateErrorWithInput(errorWebComponent, errorMessage);
};

/**
 * Removes generated error annotations from a given component and its group options (if applicable).
 *
 * @param {HTMLElement|null} el - The component from which annotations should be stripped
 * @returns {void}
 */
function removeErrorAnnotations(el) {
  if (!el) return;

  if (isGroupComponent(el)) {
    clearGroupOptionAnnotations(el);
  }

  clearHostErrorAnnotations(el);
}

/**
 * Recursively cleans up error annotations from nested shadow DOM elements.
 *
 * This function traverses through DOM elements starting from a given root,
 * specifically targeting custom elements with 'va-' prefix. For each element,
 * it checks if there are error spans present when no error message exists,
 * and removes those error annotations. The function recursively processes
 * shadow roots to handle deeply nested shadow DOM structures.
 *
 * @param {Element|ShadowRoot|Document} root - The root element or shadow root to start cleanup from
 * @returns {void}
 */
const cleanupNestedShadowRoots = root => {
  if (!root) return;

  const elements = getVaElements(root);

  elements.forEach(el => {
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

/**
 * Cleans up error annotations for form elements by synchronizing current error states
 * with previously stored error messages. Handles both regular elements and group components,
 * managing error message associations and cleanup of stale annotations.
 *
 * The function:
 * - Queries all elements with error attributes
 * - Compares current error messages with previously stored ones
 * - Removes error annotations when no current error exists
 * - Associates new error messages with inputs when errors change
 * - Synchronizes group component error states
 * - Cleans up nested shadow DOM error annotations
 *
 * @function cleanupErrorAnnotations
 * @returns {void}
 */
const cleanupErrorAnnotations = () => {
  const errorSelector = ERROR_ATTRIBUTE_SELECTOR_STRING;
  const elementsWithErrors = document.querySelectorAll(errorSelector);

  // Find elements that previously had errors but no longer do
  // These elements need cleanup to remove stale aria-labelledby references
  // Added to prevent JAWS from announcing stale error messages in radio when selecting option
  const elementsWithPreviousErrors = document.querySelectorAll(
    '[data-previous-error-message]',
  );

  const allElementsWithErrors = new Set([
    ...Array.from(elementsWithErrors),
    ...Array.from(elementsWithPreviousErrors),
  ]);

  allElementsWithErrors.forEach(el => {
    // Skip elements not in the allowedElements list
    if (!isSupportedVaElement(el)) return;
    // ============================================================================
    // CATEGORY 3: Group Option Component Synchronization
    // Sync individual group options with their parent group component's error state
    // ============================================================================
    if (isGroupOptionComponent(el)) {
      const parentGroup = findParentGroupComponent(el);
      if (parentGroup) {
        const groupErrorMessage = getErrorPropText(parentGroup);
        const optionErrorMessage = el.getAttribute('generated-error') || '';

        if (!groupErrorMessage) {
          if (optionErrorMessage) {
            el.removeAttribute('generated-error');
            removeErrorAnnotations(el);
            el.removeAttribute('data-previous-error-message');
          }
        } else if (optionErrorMessage !== groupErrorMessage) {
          el.setAttribute('generated-error', groupErrorMessage);
        }
      }
    }

    const currentErrorMessage = getErrorPropText(el);
    const previousErrorMessage =
      el.getAttribute('data-previous-error-message') || '';
    const hasExistingAnnotation =
      hasErrorAnnotation(el) || (!el.shadowRoot && !isGroupComponent(el));

    // ERROR REMOVAL: Clear annotations when no current error exists
    // Handles all categories - direct errors, child components, and groups
    if (!currentErrorMessage) {
      removeErrorAnnotations(el);

      // CATEGORY 3: Clear group-specific error synchronization
      if (isGroupComponent(el)) {
        syncGroupGeneratedErrors(el, null);
      }

      el.removeAttribute('data-previous-error-message');
    }

    // ERROR ASSOCIATION: Add/update annotations when error message changes
    // Handles all categories - direct errors, child components, and groups
    else if (
      previousErrorMessage !== currentErrorMessage ||
      !hasExistingAnnotation
    ) {
      // Clear previous error label cache when message changes
      if (
        previousErrorMessage &&
        previousErrorMessage !== currentErrorMessage
      ) {
        el.removeAttribute('data-generated-error-label-id');
      }

      // CATEGORY 1 & 2: Associate error with input elements
      associateErrorWithInput(el, currentErrorMessage);

      // CATEGORY 3: Sync group component errors to all options
      if (isGroupComponent(el)) {
        syncGroupGeneratedErrors(el, currentErrorMessage);
      }

      el.setAttribute('data-previous-error-message', currentErrorMessage);
    }

    // CATEGORY 3: Group Component Maintenance
    // Ensure group options stay synchronized even when error message unchanged
    else if (isGroupComponent(el)) {
      syncGroupGeneratedErrors(el, currentErrorMessage);
    }
  });

  // Clean up stale error annotations from deeply nested shadow DOM structures
  cleanupNestedShadowRoots(document);
};

/**
 * Runs full cleanup and re-scaffolding for every element matching the selectors.
 * Useful when external code needs to ensure annotations align with current errors.
 *
 * @param {string} selectors - CSS selector list identifying error host elements
 */
const scaffoldErrorsFromSelectors = selectors => {
  cleanupErrorAnnotations();
  const allErrors = collectAllErrorElements(selectors);
  allErrors.forEach(addErrorAnnotations);
};

/**
 * Sets up a MutationObserver to watch for error attribute changes on form elements.
 * When error attributes change (on blur or submit), it cleans up stale annotations
 * and scaffolds new ones for accessibility.
 *
 * @param {boolean} [scaffoldAndFocusFormErrors]
 *   Determines whether to enable error scaffolding watch. When false, the observer will not start.
 * @returns {Function} Cleanup function to disconnect the observer
 */
const watchErrorUpdates = (
  scaffoldAndFocusFormErrors = DEFAULT_SCAFFOLD_AND_FOCUS_FORM_ERRORS,
) => {
  if (typeof window === 'undefined' || !scaffoldAndFocusFormErrors) {
    return () => {};
  }

  const observerConfig = {
    attributes: true,
    attributeFilter: ERROR_ATTR_SELECTORS,
    subtree: true,
  };
  const errorSelector = ERROR_ATTRIBUTE_SELECTOR_STRING;

  // Use requestAnimationFrame to ensure scaffolding runs
  // after the browser completes the current rendering cycle and shadow DOM updates
  // are fully processed. This provides consistent timing across all browsers.
  let animationFrameId;
  const handleErrorChange = () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    animationFrameId = requestAnimationFrame(() => {
      scaffoldErrorsFromSelectors(errorSelector);
    });
  };

  const observer = new MutationObserver(handleErrorChange);
  observer.observe(document, observerConfig);

  // Return cleanup function
  return () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    observer.disconnect();
  };
};

export {
  DEFAULT_SCAFFOLD_AND_FOCUS_FORM_ERRORS,
  ERROR_ATTR_SELECTORS,
  ERROR_SPAN_SELECTOR,
  addErrorAnnotations,
  cleanupErrorAnnotations,
  collectAllErrorElements,
  findFocusTarget,
  getErrorPropText,
  isSupportedVaElement,
  scaffoldErrorsFromSelectors,
  watchErrorUpdates,
};
