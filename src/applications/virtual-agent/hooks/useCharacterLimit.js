import { useEffect } from 'react';

// Character limit constant for input field
export const CHARACTER_LIMIT = 400;
// Threshold for turning counter red
export const RED_THRESHOLD = 390;
// Delay in milliseconds before updating screen reader element to allow input value to finish reading
export const SCREEN_READER_UPDATE_DELAY = 1500;

/**
 * Finds the WebChat input element
 * @returns {HTMLInputElement|null} The input element or null if not found
 */
export function getInputElement() {
  return document.querySelector('input.webchat__send-box-text-box__input');
}

/**
 * Finds the visual character counter element
 * @returns {HTMLDivElement|null} The counter element or null if not found
 */
export function getCounterElement() {
  return document.querySelector('.webchat-character-counter');
}

/**
 * Finds the screen reader character counter element
 * @returns {HTMLSpanElement|null} The screen reader counter element or null if not found
 */
export function getSrElement() {
  return document.querySelector('#charcount-message');
}

/**
 * Calculates the counter text based on current input length
 * @param {number} currentLength - Current length of input value
 * @param {number} characterLimit - Maximum number of characters allowed
 * @returns {string} The counter text (e.g., "400 characters allowed" or "39 characters left")
 */
export function getCounterText(currentLength, characterLimit) {
  const charactersLeft = characterLimit - currentLength;
  const textSuffix = currentLength === 0 ? 'allowed' : 'left';
  const character = charactersLeft === 1 ? 'character' : 'characters';
  return `${charactersLeft} ${character} ${textSuffix}`;
}

/**
 * Updates the character counter text and warning state
 * @param {HTMLDivElement} visibleElement - The visible counter element
 * @param {HTMLSpanElement} srElement - The screen reader counter element
 * @param {HTMLInputElement} inputElement - The input element
 * @param {number} characterLimit - Maximum number of characters allowed
 * @param {number} redThreshold - Character count at which to show warning (red)
 */
export function updateCounter(
  visibleElement,
  srElement,
  inputElement,
  characterLimit,
  redThreshold,
) {
  const currentLength = inputElement.value.length;
  const isNearLimit = currentLength >= redThreshold;
  const counterText = getCounterText(currentLength, characterLimit);

  // Update visible element
  const visible = visibleElement;
  visible.textContent = counterText;
  if (isNearLimit) {
    visible.classList.add('warning');
  } else {
    visible.classList.remove('warning');
  }

  // Update screen reader element
  const sr = srElement;
  sr.textContent = counterText;
}

/**
 * Creates or finds the character counter elements and appends them to the DOM
 * @returns {{visibleElement: HTMLDivElement, srElement: HTMLSpanElement}} The counter elements
 */
export function createCounterElements() {
  // Check if counter already exists
  const existingVisible = getCounterElement();
  if (existingVisible) {
    const existingSr = getSrElement();
    return {
      visibleElement: existingVisible,
      srElement: existingSr,
    };
  }

  const formElement = document.querySelector('form.webchat__send-box-text-box');
  const sendButton = document.querySelector('button.webchat__send-button');

  // Create the visible character counter element (hidden from screen readers)
  const visibleElement = document.createElement('div');
  visibleElement.className = 'webchat-character-counter';
  visibleElement.setAttribute('aria-hidden', 'true');

  // Create the screen reader-only character counter element
  const srElement = document.createElement('span');
  srElement.id = 'charcount-message';
  srElement.className = 'sr-only';
  srElement.setAttribute('aria-live', 'polite');
  srElement.setAttribute('aria-atomic', 'true');

  // Insert both elements after the form element but before the send button
  formElement.parentElement.insertBefore(visibleElement, sendButton);
  formElement.parentElement.insertBefore(srElement, sendButton);

  return { visibleElement, srElement };
}

/**
 * Sets up character limit enforcement and indicator on the input element
 * @param {number} characterLimit - Maximum number of characters allowed
 * @param {number} redThreshold - Character count at which to show warning (red)
 * @returns {Function|undefined} Cleanup function, or undefined if input not found
 */
export function setupCharacterLimit(characterLimit, redThreshold) {
  const inputElement = getInputElement();

  if (!inputElement) {
    return undefined;
  }

  // Set the maxLength attribute to prevent typing beyond the limit
  inputElement.setAttribute('maxLength', characterLimit.toString());

  // Create or find the character counter elements
  const { visibleElement, srElement } = createCounterElements();

  // Set up aria-describedby on input to reference the screen reader counter
  const existingDescribedBy = inputElement.getAttribute('aria-describedby');
  const counterId = srElement.id;
  const describedByValue = existingDescribedBy
    ? `${existingDescribedBy} ${counterId}`
    : counterId;
  inputElement.setAttribute('aria-describedby', describedByValue);

  // Initial counter update
  updateCounter(
    visibleElement,
    srElement,
    inputElement,
    characterLimit,
    redThreshold,
  );

  // Update the counter on input with a debounce to avoid interrupting
  // screen reader announcements while typing.
  let updateTimeout = null;
  const handleInput = () => {
    // Clear any pending update
    if (updateTimeout) {
      clearTimeout(updateTimeout);
    }

    // Update visible element immediately for visual feedback
    const currentLength = inputElement.value.length;
    const isNearLimit = currentLength >= redThreshold;
    const counterText = getCounterText(currentLength, characterLimit);

    visibleElement.textContent = counterText;
    if (isNearLimit) {
      visibleElement.classList.add('warning');
    } else {
      visibleElement.classList.remove('warning');
    }

    // Update screen reader element with a delay to allow screen reader to finish reading input value
    updateTimeout = setTimeout(() => {
      // Only update if text has changed to trigger aria-live announcement
      if (srElement.textContent !== counterText) {
        srElement.textContent = counterText;
      }
      updateTimeout = null;
    }, SCREEN_READER_UPDATE_DELAY);
  };
  inputElement.addEventListener('input', handleInput);

  return () => {
    if (updateTimeout) {
      clearTimeout(updateTimeout);
    }

    inputElement.removeEventListener('input', handleInput);

    const currentDescribedBy = inputElement.getAttribute('aria-describedby');
    if (currentDescribedBy) {
      const ids = currentDescribedBy
        .split(/\s+/)
        .filter(id => id !== counterId);
      if (ids.length > 0) {
        inputElement.setAttribute('aria-describedby', ids.join(' '));
      } else {
        inputElement.removeAttribute('aria-describedby');
      }
    }

    if (visibleElement && visibleElement.parentElement) {
      visibleElement.parentElement.removeChild(visibleElement);
    }

    if (srElement && srElement.parentElement) {
      srElement.parentElement.removeChild(srElement);
    }
  };
}

/**
 * Checks if input was cleared and resets counter
 * @param {HTMLInputElement} inputElement - The input element
 * @param {string} previousValue - The previous input value
 * @param {number} characterLimit - Maximum number of characters allowed
 * @param {number} redThreshold - Character count at which to show warning (red)
 * @returns {string} The current input value
 */
export function checkAndResetCounterIfCleared(
  inputElement,
  previousValue,
  characterLimit,
  redThreshold,
) {
  const currentValue = inputElement.value || '';
  if (previousValue !== '' && currentValue === '') {
    // Input was cleared after having content - reset counter
    const visibleElement = getCounterElement();
    const srElement = getSrElement();
    if (visibleElement && srElement) {
      updateCounter(
        visibleElement,
        srElement,
        inputElement,
        characterLimit,
        redThreshold,
      );
    }
  }
  return currentValue;
}

/**
 * Creates a MutationObserver callback function to setup the character
 * limit when the input is added to the DOM
 * @param {Object} refs - Object with cleanupRef and stateRef properties
 * @param {number} characterLimit - Maximum number of characters allowed
 * @param {number} redThreshold - Character count at which to show warning (red)
 * @returns {Function} The MutationObserver callback function
 */
export function createMutationObserverCallback(
  refs,
  characterLimit,
  redThreshold,
) {
  return () => {
    const inputElement = getInputElement();
    const counterExists = getCounterElement() !== null;

    if (inputElement && !counterExists) {
      // If input exists but counter doesn't, setup the character limit
      const cleanupRefObj = refs.cleanupRef;
      const stateRefObj = refs.stateRef;
      if (cleanupRefObj.current) {
        cleanupRefObj.current();
      }
      const newCleanup = setupCharacterLimit(characterLimit, redThreshold);
      cleanupRefObj.current = newCleanup;
      stateRefObj.current.previousInputValue = inputElement.value || '';
    } else if (inputElement && counterExists) {
      // Check if input value changed from non-empty to empty (message was sent)
      const stateRefObj = refs.stateRef;
      stateRefObj.current.previousInputValue = checkAndResetCounterIfCleared(
        inputElement,
        stateRefObj.current.previousInputValue,
        characterLimit,
        redThreshold,
      );
    }
  };
}

/**
 * Hook that adds a character counter and enforces character limit
 * @param {boolean} isEnabled - Whether to enable the character limit feature
 */
export default function useCharacterLimit(isEnabled) {
  useEffect(
    () => {
      // Only enable character limit if the feature toggle is true
      if (!isEnabled) {
        return () => {};
      }

      // Setup the character limit on page load
      const initialCleanup = setupCharacterLimit(
        CHARACTER_LIMIT,
        RED_THRESHOLD,
      );

      // Track previous input value to detect when it becomes empty (after message sent)
      const cleanupRef = { current: initialCleanup };
      const stateRef = { current: { previousInputValue: '' } };

      // Setup a MutationObserver to watch for when the input is added to the DOM
      const observerCallback = createMutationObserverCallback(
        { cleanupRef, stateRef },
        CHARACTER_LIMIT,
        RED_THRESHOLD,
      );
      const observer = new MutationObserver(observerCallback);

      // Observe the document body for changes in the webchat area
      const observeTarget = document.querySelector('[data-testid="webchat"]');
      if (observeTarget) {
        observer.observe(observeTarget, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['value'],
        });
      }

      return () => {
        observer.disconnect();
        if (cleanupRef.current) {
          cleanupRef.current();
        }
      };
    },
    [isEnabled],
  );
}
