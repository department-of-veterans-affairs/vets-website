// ============================================================================
// ERROR SCAFFOLDING
// Screen reader accessibility for VA form component error states
// ============================================================================
//
// OVERVIEW
// --------
// This module manages screen reader announcements for form validation errors
// in VA Design System web components. It creates hidden labels that provide
// context when users focus on invalid form fields.
//
// CATEGORY DETAILS
// ----------------
// CATEGORY 1 – DIRECT ERROR
//   Components: va-text-input, va-textarea, va-select, va-combo-box,
//               va-file-input, va-file-input-multiple
//   The component itself receives the error attribute and is found directly in
//   the initial error query. We attach the screen reader label to its focus
//   target inside its shadow DOM.
//
// CATEGORY 2 – NESTED COMPONENT ERROR
//   Components: va-statement-of-truth
//   Wrapper components that delegate errors to internal VA children. These nested
//   error components require special discovery logic (searching within shadow roots)
//   but are processed the same as Category 1 once found.
//
// CATEGORY 3 – GROUP COMPONENT ERROR
//   Components: va-radio, va-radio-option, va-checkbox-group, va-checkbox
//   Group hosts receive the parent error while each option mirrors the message
//   via an alternate attribute. We propagate labels to every option to avoid
//   repeated announcements when focus moves within the group.
//
// CATEGORY 4 – DATE COMPONENT ERROR
//   Components: va-date, va-memorable-date
//   Date components delegate validation to their child inputs (va-select,
//   va-text-input). We attach error labels to each invalid child using the
//   parent's error message for context.
//
// ============================================================================

// ============================================================================
// Category Detection & Configuration
// ============================================================================
// Default value for the scaffoldAndFocusFormErrors formOption
// If you need to turn this off, set this value to false in your form config.
// Example implementation:
// formOptions: {scaffoldAndFocusFormErrors: false}
const DEFAULT_SCAFFOLD_AND_FOCUS_FORM_ERRORS = true;

// Supported components from the component-library
// TODO: create a fix that targets all va- components, not just the ones in this list
const SUPPORTED_ELEMENTS = [
  // Category 1: Direct error components
  'va-text-input',
  'va-textarea',
  'va-select',
  'va-combo-box',
  'va-file-input',
  'va-file-input-multiple',
  // Category 2: Child component error wrappers
  'va-statement-of-truth',
  // Category 3: Group components and their options
  'va-radio',
  'va-radio-option',
  'va-checkbox-group',
  'va-checkbox',
  // Category 4: Date components
  'va-date',
  'va-memorable-date',
];

const ERROR_ATTR_SELECTORS = [
  'error',
  'input-error', // for va-statement-of-truth
  'checkbox-error', // for va-statement-of-truth
  'generated-error', // generated in this file for group options
];
const ERROR_ATTRIBUTE_SELECTOR_STRING = ERROR_ATTR_SELECTORS.map(
  attr => `[${attr}]`,
).join(', ');

const HIDDEN_FILTER = ':not([aria-hidden="true"]):not([hidden])';
const INPUT_SELECTOR = `input${HIDDEN_FILTER}, textarea${HIDDEN_FILTER}, select${HIDDEN_FILTER}`;
const ERROR_SPAN_SELECTOR = 'span.usa-sr-only[id^="error-label-"]';
const ERROR_MESSAGE_SELECTORS = [
  '#error-message',
  '#input-error-message',
  '#radio-error-message',
  '#checkbox-error-message',
];

// Category 3: Group Components
const GROUP_COMPONENT_TAGS = ['VA-RADIO', 'VA-CHECKBOX-GROUP'];
const GROUP_OPTION_TAGS = ['VA-RADIO-OPTION', 'VA-CHECKBOX'];
const GROUP_OPTION_SELECTOR = 'va-radio-option, va-checkbox';
const GROUP_SELECTOR = GROUP_COMPONENT_TAGS.map(tag => tag.toLowerCase()).join(
  ', ',
);

// Category 4: Date Components
const DATE_COMPONENT_TAGS = ['VA-DATE', 'VA-MEMORABLE-DATE'];
const DATE_CHILD_SELECTOR = 'va-select, va-text-input';

// State Tracking
const DATA_PREVIOUS_ERROR_MESSAGE = 'data-previous-error-message';
const DATA_GENERATED_ERROR_LABEL_ID = 'data-generated-error-label-id';

// ============================================================================
// GENERAL HELPERS
// Shared utilities used across all categories
// ============================================================================

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

  return SUPPORTED_ELEMENTS.includes(element.tagName.toLowerCase());
};

/**
 * Collects VA design system elements under the provided root.
 * Uses a direct selector query for better performance than filtering all elements.
 *
 * @param {Element|ShadowRoot|Document|null} root - The root node to scan
 * @returns {HTMLElement[]} Array of descendant VA components, or empty array when none are present
 */
const getSupportedVaElements = root => {
  if (!root?.querySelectorAll) {
    return [];
  }

  return Array.from(root.querySelectorAll(SUPPORTED_ELEMENTS.join(', ')));
};

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
 * Normalizes text for error label composition by trimming whitespace and
 * stripping trailing punctuation. This allows buildErrorLabelText to control
 * punctuation consistently without creating double periods.
 *
 * @param {string} text - The text to normalize
 * @returns {string} Text with trailing periods/punctuation removed and whitespace trimmed
 */
const normalizeText = text => {
  if (!text) return '';
  return text.trim().replace(/[.]+$/, '');
};

// ============================================================================
// CATEGORY 4: DATE COMPONENT HELPERS
// Detection and child component utilities for va-date and va-memorable-date.
// Defined early because getErrorPropText and getLabelText depend on them.
// ============================================================================

/**
 * Determines if an element is a date component based on its tag name.
 * Date components include va-date and va-memorable-date.
 *
 * @param {Element|null|undefined} element - The DOM element to check
 * @returns {boolean} True if the element is a date component, false otherwise
 */
const isDateComponent = element =>
  isComponentOfType(element, DATE_COMPONENT_TAGS);

/**
 * Checks if an element is a child component inside a date component's shadow DOM.
 * These should be skipped for independent error processing since the parent
 * date component handles their error annotations.
 *
 * @param {HTMLElement} el - The element to check
 * @returns {boolean} True if the element is inside a date component's shadow root
 */
const hasDateComponentParent = el =>
  isComponentOfType(el.getRootNode()?.host, DATE_COMPONENT_TAGS);

/**
 * Retrieves all child input components (va-select, va-text-input) from a date component's shadow DOM.
 *
 * @param {Element|null|undefined} element - The date component to query
 * @returns {HTMLElement[]} An array of child input components
 */
const getDateChildComponents = element => {
  if (!element?.shadowRoot) return [];
  return Array.from(element.shadowRoot.querySelectorAll(DATE_CHILD_SELECTOR));
};

/**
 * Extracts error message text from #error-message span for date components.
 *
 * @param {HTMLElement} el - The date component element
 * @returns {string} The error message text from the span, or empty string if not found
 */
const getDateErrorMessageText = el => {
  const errorMessageSpan = el.shadowRoot?.querySelector('#error-message');
  return errorMessageSpan?.textContent?.trim() || '';
};

/**
 * Finds the first invalid child input within a date component.
 * Checks for the 'invalid' attribute or property on each child.
 *
 * @param {HTMLElement} dateComponent - The date component to search within
 * @returns {HTMLElement|undefined} The first invalid child component, or undefined if none found
 */
const findFirstInvalidDateChild = dateComponent => {
  const children = getDateChildComponents(dateComponent);
  return children.find(
    child => child.hasAttribute('invalid') || child.invalid === true,
  );
};

// ============================================================================
// CATEGORY 3: GROUP COMPONENT HELPERS
// Detection and traversal utilities for va-radio and va-checkbox-group.
// ============================================================================
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
// ERROR TEXT & LABEL EXTRACTION
// Utilities for reading error messages and label text from components.
// ============================================================================

/**
 * Extracts error message text from a DOM element by checking various error attributes and properties.
 * Iterates through predefined error attribute selectors to find the first available error message.
 * Falls back to the element's error property if no attribute contains a message.
 *
 * @param {HTMLElement} el - The DOM element to extract error text from
 * @returns {string} The error message text, or an empty string if no error is found
 */
const getErrorPropText = el => {
  // For date components, only read from #error-message span.
  // The error attribute contains codes that the component translates to
  // human-readable text in #error-message. If empty, no error to display yet.
  if (isDateComponent(el)) {
    return getDateErrorMessageText(el);
  }

  for (const attr of ERROR_ATTR_SELECTORS) {
    const msg = el.getAttribute(attr);
    if (msg) return msg;
  }
  return el.error || '';
};

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
    const nestedErrors = getSupportedVaElements(el.shadowRoot).filter(child =>
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
 * 2. The 'input-label' attribute or 'inputLabel' property as fallback (skipped for
 *    date components where input-label is used for the legend, not the child label)
 * 3. Text content from a label element within the element's shadow DOM as final fallback
 *
 * @param {HTMLElement} el - The DOM element to extract label text from
 * @returns {string} The label text found, or an empty string if no label is found
 */
const getLabelText = el => {
  let labelText = el.getAttribute('label') || el.label || '';

  // Skip input-label for date components—they use it for the legend, not individual
  // child labels. For date components, fall through to the <label> element lookup.
  if (!labelText && !isDateComponent(el)) {
    labelText = el.getAttribute('input-label') || el.inputLabel || '';
  }

  if (!labelText) {
    const labelElement = el.shadowRoot?.querySelector('label');
    labelText = labelElement?.textContent?.trim() || '';
  }

  return labelText;
};

// ============================================================================
// FOCUS TARGET RESOLUTION
// Determines which element should receive focus when navigating to an error.
// ============================================================================

/**
 * Resolves the element that should receive focus for a component displaying an error state.
 *
 * The lookup prioritizes:
 * 1. For date components: First invalid child input, or first child for cross-field validation errors
 * 2. Group option inputs when invoked on a radio or checkbox group
 * 3. Child elements already carrying an error attribute
 * 4. The first native form control within the component's shadow root
 * 5. Nested VA components that expose their own focus targets
 * 6. Any other focusable node within the component
 * 7. Finally the component itself when no better target is found
 *
 * @param {HTMLElement} el - The host web component being evaluated
 * @returns {HTMLElement} The element that should receive focus
 */
const findFocusTarget = el => {
  // CATEGORY 4: Date component handling
  // Find the first invalid child input, or fall back to first child
  // (for cross-field validation where all children are technically valid)
  if (isDateComponent(el)) {
    const invalidChild = findFirstInvalidDateChild(el);
    if (invalidChild) {
      return findFocusTarget(invalidChild);
    }
    // Fallback to first child component for cross-field validation errors
    const children = getDateChildComponents(el);
    if (children.length) {
      return findFocusTarget(children[0]);
    }
  }

  // CATEGORY 3: Group component handling
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
  const nestedComponents = getSupportedVaElements(shadowRoot);
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

// ============================================================================
// ERROR LABEL CREATION
// Building and attaching screen reader labels to form inputs.
// ============================================================================

/**
 * Builds the screen reader friendly text used inside generated error labels.
 *
 * For most components (Categories 1-3):
 *   Order: {error}. {parent label}. {child label}. {hint}. {description}
 *
 * For date components (Category 4):
 *   Order: {error}. {child label}. {parent label}
 *
 * @param {string} errorMessage - Raw error message coming from the component
 * @param {HTMLElement} errorWebComponent - The component producing the error
 * @param {HTMLElement|null} [childOption=null] - Optional child element (group option or date child)
 * @returns {string} Fully composed label text containing context, hints, and descriptions
 */
const buildErrorLabelText = (
  errorMessage,
  errorWebComponent,
  childOption = null,
) => {
  const errorText = normalizeText(errorMessage.replace(/^Error\s*/i, ''));
  const parentLabel = normalizeText(getLabelText(errorWebComponent));
  const hintElement = errorWebComponent.shadowRoot?.querySelector(
    '.usa-hint, .hint-text',
  );
  const hintText = normalizeText(hintElement?.textContent || '');
  const descriptionElement = errorWebComponent.shadowRoot?.querySelector(
    '.usa-checkbox__label-description',
  );
  const descriptionText = normalizeText(descriptionElement?.textContent || '');

  let fullText = `Error: ${errorText}.`;

  // Date components: {error}. {child label}. {parent label}. {hint (va-date only)}
  if (isDateComponent(errorWebComponent) && childOption) {
    const childLabel = normalizeText(getLabelText(childOption));
    if (childLabel) {
      fullText += ` ${childLabel}.`;
    }

    // Add parent legend for context
    if (parentLabel) {
      fullText += ` ${parentLabel}.`;
    }

    // Add hint text for va-date only (va-memorable-date default hint is confusing)
    if (hintText && errorWebComponent.tagName === 'VA-DATE') {
      fullText += ` ${hintText}.`;
    }
  } else {
    // Groups & direct errors: {error}. {parent label}. {child label}. {hint}. {description}
    if (parentLabel) {
      fullText += ` ${parentLabel}.`;
    }

    if (childOption) {
      const childLabelText = normalizeText(getLabelText(childOption));
      if (childLabelText) {
        fullText += ` ${childLabelText}.`;
      }
    }

    if (descriptionText) {
      fullText += ` ${descriptionText}.`;
    }

    if (hintText) {
      fullText += ` ${hintText}.`;
    }
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
 * - Removes aria-describedby attribute to avoid conflicts (except for date components)
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
    DATA_GENERATED_ERROR_LABEL_ID,
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
        .substring(2, 9)}`;
    labelSpan.className = 'usa-sr-only';
    container.appendChild(labelSpan);
    labelId = labelSpan.id;
  }

  labelSpan.textContent = fullText;

  input.setAttribute('aria-labelledby', labelId);
  if (hostComponent?.setAttribute) {
    hostComponent.setAttribute(DATA_GENERATED_ERROR_LABEL_ID, labelId);
  }

  // Preserve aria-describedby for date component children - they use it for
  // #input-message (format hints). For other components, remove it to avoid
  // potential conflicts with our comprehensive error label.
  if (!hasDateComponentParent(hostComponent)) {
    input.removeAttribute('aria-describedby');
  }
};

// ============================================================================
// CATEGORY 3: GROUP ERROR ANNOTATION
// Error propagation and cleanup for va-radio and va-checkbox-group.
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
function syncGroupErrorAttributes(groupElement, errorMessage) {
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
    syncGroupErrorAttributes(groupComponent, null);
    return;
  }

  const options = syncGroupErrorAttributes(groupComponent, errorMessage);
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

// ============================================================================
// CATEGORY 4: DATE COMPONENT ERROR STYLING & ANNOTATION
// Validation, styling, and annotation for va-date and va-memorable-date.
// ============================================================================

/**
 * Checks if a date child component is invalid for accessibility scaffolding purposes.
 * A child is considered invalid if:
 * 1. The child component has the 'invalid' attribute/property (set by component-library on blur), OR
 * 2. Its internal input/select has aria-invalid="true"
 *
 * @param {HTMLElement} childComponent - The va-select or va-text-input child
 * @returns {boolean} True if the child is invalid
 */
function isDateChildInvalid(childComponent) {
  if (!childComponent?.shadowRoot) return false;

  const input = childComponent.shadowRoot.querySelector(INPUT_SELECTOR);

  // Check invalid attribute/property on the child component itself,
  // or aria-invalid on the internal input
  return (
    childComponent.hasAttribute('invalid') ||
    childComponent.invalid === true ||
    input?.getAttribute('aria-invalid') === 'true'
  );
}

/**
 * Associates error annotations with date component child inputs.
 * Handles two distinct error scenarios:
 *
 * 1. Field-level errors: Individual child inputs are invalid (empty required fields,
 *    invalid formats). Only invalid children receive accessibility scaffolding.
 *
 * 2. Cross-field validation errors: Parent has an error but all children are technically
 *    valid (e.g., "To date must be after from date"). ALL children receive accessibility
 *    scaffolding for screen readers to announce the cross-field validation error.
 *
 * @param {HTMLElement} dateComponent - The date component emitting an error
 * @param {string|null} errorMessage - Message to associate with the child input
 * @returns {void}
 */
function associateDateErrorAnnotations(dateComponent, errorMessage) {
  if (!errorMessage) return;

  const children = getDateChildComponents(dateComponent);

  // Determine which children need screen reader scaffolding:
  // - If ANY child is invalid: only scaffold invalid children (field-level errors)
  // - If NO children are invalid: scaffold ALL children (cross-field validation)
  const invalidChildren = children.filter(child => isDateChildInvalid(child));
  const childrenToScaffold =
    invalidChildren.length > 0 ? invalidChildren : children;

  // Add screen reader scaffolding to target children
  childrenToScaffold.forEach(child => {
    const inputElement = findFocusTarget(child);
    if (!inputElement) return;

    const fullText = buildErrorLabelText(errorMessage, dateComponent, child);
    createAndAssociateErrorLabel(inputElement, fullText, child);
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

  hostComponent.removeAttribute(DATA_GENERATED_ERROR_LABEL_ID);
};

// Category 4: Date cleanup

/**
 * Clears error annotations from all child inputs within a date component.
 *
 * @param {HTMLElement} dateComponent - The date component to clear
 * @returns {void}
 */
function clearDateErrorAnnotations(dateComponent) {
  const children = getDateChildComponents(dateComponent);
  children.forEach(child => {
    clearHostErrorAnnotations(child);
    child.removeAttribute(DATA_PREVIOUS_ERROR_MESSAGE);
  });
}

// Category 3: Group cleanup

/**
 * Clears cached error state for every option belonging to the supplied group component.
 *
 * @param {HTMLElement} groupComponent - Radio or checkbox group to clear
 * @returns {void}
 */
function clearGroupOptionAnnotations(groupComponent) {
  const options = syncGroupErrorAttributes(groupComponent, null);
  options.forEach(option => {
    clearHostErrorAnnotations(option);
    option.removeAttribute(DATA_PREVIOUS_ERROR_MESSAGE);
  });
}

// ============================================================================
// ERROR ASSOCIATION ORCHESTRATION
// Main entry points that route to category-specific handlers.
// ============================================================================

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
  // CATEGORY 3: Group component handling
  if (isGroupComponent(errorWebComponent)) {
    associateGroupErrorAnnotations(errorWebComponent, errorMessage);
    return;
  }

  // CATEGORY 4: Date component handling
  if (isDateComponent(errorWebComponent)) {
    associateDateErrorAnnotations(errorWebComponent, errorMessage);
    return;
  }

  // CATEGORY 1 & 2: Direct error and child component handling
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
  // Skip elements not in the SUPPORTED_ELEMENT list
  if (!isSupportedVaElement(errorWebComponent)) return;

  // Skip child components inside date component shadow DOM - the parent handles them
  if (hasDateComponentParent(errorWebComponent)) return;

  // Remove alert role from ALL error message elements to prevent duplicate announcements
  // Use querySelectorAll since date components may have multiple error message spans
  const errorElements = errorWebComponent?.shadowRoot?.querySelectorAll(
    ERROR_MESSAGE_SELECTORS.join(', '),
  );
  errorElements?.forEach(el => {
    el.removeAttribute('role');
    el.removeAttribute('aria-live');
  });

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

  // CATEGORY 3: Group component cleanup
  if (isGroupComponent(el)) {
    clearGroupOptionAnnotations(el);
  }

  // CATEGORY 4: Date component cleanup
  if (isDateComponent(el)) {
    clearDateErrorAnnotations(el);
  }

  clearHostErrorAnnotations(el);
}

// ============================================================================
// CLEANUP & SYNCHRONIZATION
// Batch processing of error state changes across the document.
// ============================================================================

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

  const elements = getSupportedVaElements(root);

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
 * Collects all elements that currently have or previously had error states.
 * Includes elements with error attributes and elements with cached previous error messages.
 *
 * @returns {Set<HTMLElement>} Set of elements requiring error state evaluation
 */
const collectElementsWithErrorState = () => {
  const errorSelector = ERROR_ATTRIBUTE_SELECTOR_STRING;
  const elementsWithErrors = document.querySelectorAll(errorSelector);

  // Find elements that previously had errors but no longer do
  // These elements need cleanup to remove stale aria-labelledby references
  // Added to prevent JAWS from announcing stale error messages in radio when selecting option
  const elementsWithPreviousErrors = document.querySelectorAll(
    `[${DATA_PREVIOUS_ERROR_MESSAGE}]`,
  );

  return new Set([
    ...Array.from(elementsWithErrors),
    ...Array.from(elementsWithPreviousErrors),
  ]);
};

/**
 * Synchronizes a group option's error state with its parent group component.
 * Ensures the option's generated-error attribute matches the parent's error state.
 *
 * @param {HTMLElement} option - The group option element (va-radio-option or va-checkbox)
 * @returns {void}
 */
const syncGroupOptionWithParent = option => {
  const parentGroup = findParentGroupComponent(option);
  if (!parentGroup) return;

  const groupErrorMessage = getErrorPropText(parentGroup);
  const optionErrorMessage = option.getAttribute('generated-error') || '';

  if (!groupErrorMessage) {
    if (optionErrorMessage) {
      option.removeAttribute('generated-error');
      removeErrorAnnotations(option);
      option.removeAttribute(DATA_PREVIOUS_ERROR_MESSAGE);
    }
  } else if (optionErrorMessage !== groupErrorMessage) {
    option.setAttribute('generated-error', groupErrorMessage);
  }
};

/**
 * Clears error annotations and cached state from an element.
 * Handles group component cleanup by also clearing synchronized errors.
 *
 * @param {HTMLElement} el - The element to clear
 * @returns {void}
 */
const clearErrorAnnotations = el => {
  removeErrorAnnotations(el);

  if (isGroupComponent(el)) {
    syncGroupErrorAttributes(el, null);
  }

  el.removeAttribute(DATA_PREVIOUS_ERROR_MESSAGE);
};

/**
 * Applies error annotations when an element's error message has changed.
 * Clears stale labels, associates new error messages, and syncs group components.
 *
 * @param {HTMLElement} el - The element with an error message
 * @param {string} currentErrorMessage - The new error message
 * @param {string} previousErrorMessage - The previous error message (may be empty)
 * @returns {void}
 */
const applyErrorAnnotations = (
  el,
  currentErrorMessage,
  previousErrorMessage,
) => {
  // Clear previous error label cache when message changes
  if (previousErrorMessage && previousErrorMessage !== currentErrorMessage) {
    el.removeAttribute(DATA_GENERATED_ERROR_LABEL_ID);
  }

  associateErrorWithInput(el, currentErrorMessage);

  if (isGroupComponent(el)) {
    syncGroupErrorAttributes(el, currentErrorMessage);
  }

  el.setAttribute(DATA_PREVIOUS_ERROR_MESSAGE, currentErrorMessage);
};

/**
 * Synchronizes error annotations for a single element based on its current error state.
 * Handles clearing, applying, and maintaining annotations as needed.
 *
 * @param {HTMLElement} el - The element to synchronize
 * @returns {void}
 */
const syncErrorAnnotations = el => {
  if (!isSupportedVaElement(el)) return;

  // Sync group options with their parent's error state
  if (isGroupOptionComponent(el)) {
    syncGroupOptionWithParent(el);
  }

  const currentErrorMessage = getErrorPropText(el);
  const previousErrorMessage =
    el.getAttribute(DATA_PREVIOUS_ERROR_MESSAGE) || '';
  const hasExistingAnnotation =
    hasErrorAnnotation(el) || (!el.shadowRoot && !isGroupComponent(el));

  // No current error: clear all annotations
  if (!currentErrorMessage) {
    clearErrorAnnotations(el);
    return;
  }

  // Error message changed or missing annotation: update annotations
  if (previousErrorMessage !== currentErrorMessage || !hasExistingAnnotation) {
    applyErrorAnnotations(el, currentErrorMessage, previousErrorMessage);
    return;
  }

  // Error unchanged but ensure group options stay synchronized
  if (isGroupComponent(el)) {
    syncGroupErrorAttributes(el, currentErrorMessage);
  }
};

/**
 * Cleans up error annotations for form elements by synchronizing current error states
 * with previously stored error messages. Handles all component categories including
 * direct errors, child components, groups, and date components.
 *
 * @function cleanupErrorAnnotations
 * @returns {void}
 */
const cleanupErrorAnnotations = () => {
  const elementsWithErrorState = collectElementsWithErrorState();
  elementsWithErrorState.forEach(syncErrorAnnotations);
  cleanupNestedShadowRoots(document);
};

// ============================================================================
// EXPORTS
// ============================================================================

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
  addErrorAnnotations,
  cleanupErrorAnnotations,
  collectAllErrorElements,
  findFocusTarget,
  getErrorPropText,
  isSupportedVaElement,
  scaffoldErrorsFromSelectors,
  watchErrorUpdates,
};
