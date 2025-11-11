import { useEffect } from 'react';

// Character limit constant - should match the limit in useWebChatStore.js
const CHARACTER_LIMIT = 400;
// Threshold for turning counter red
const RED_THRESHOLD = 390;

/**
 * Finds the WebChat input element
 * @returns {HTMLInputElement|null} The input element or null if not found
 */
export function getInputElement() {
  return document.querySelector('input.webchat__send-box-text-box__input');
}

/**
 * Finds the character counter element
 * @returns {HTMLDivElement|null} The counter element or null if not found
 */
export function getCounterElement() {
  return document.querySelector('.webchat-character-counter');
}

/**
 * Updates the character counter text and warning state
 * @param {HTMLDivElement} counterElement - The counter element
 * @param {HTMLInputElement} inputElement - The input element
 * @param {number} characterLimit - Maximum number of characters allowed
 * @param {number} redThreshold - Character count at which to show warning (red)
 */
export function updateCounter(
  counterElement,
  inputElement,
  characterLimit,
  redThreshold,
) {
  const currentLength = inputElement.value.length;
  const charactersLeft = characterLimit - currentLength;
  const isNearLimit = currentLength >= redThreshold;

  // Update counter text to show "x characters left"
  const element = counterElement;
  element.textContent = `${charactersLeft} characters left`;
  // Turn red when approaching limit using CSS class
  if (isNearLimit) {
    element.classList.add('warning');
  } else {
    element.classList.remove('warning');
  }
}

/**
 * Creates or finds the character counter element and appends it to the DOM
 * @returns {HTMLDivElement} The counter element
 */
export function createCounterElement() {
  // Check if counter already exists
  let counterElement = getCounterElement();
  if (counterElement) {
    return counterElement;
  }

  const formElement = document.querySelector('form.webchat__send-box-text-box');
  const sendButton = document.querySelector('button.webchat__send-button');

  // Create the character counter element
  counterElement = document.createElement('div');
  counterElement.className = 'webchat-character-counter';
  // Make it focusable for accessibility (tab order: input -> counter -> send button)
  counterElement.setAttribute('tabindex', '0');

  // Insert counter after the form element but before the send button
  formElement.parentElement.insertBefore(counterElement, sendButton);

  return counterElement;
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

  // Create or find the character counter element
  const counterElement = createCounterElement();

  // Initial counter update
  updateCounter(counterElement, inputElement, characterLimit, redThreshold);

  // Update the counter on input
  const handleInput = () =>
    updateCounter(counterElement, inputElement, characterLimit, redThreshold);
  inputElement.addEventListener('input', handleInput);

  return () => {
    inputElement.removeEventListener('input', handleInput);
    if (counterElement && counterElement.parentElement) {
      counterElement.parentElement.removeChild(counterElement);
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
    const counterElement = getCounterElement();
    if (counterElement) {
      updateCounter(counterElement, inputElement, characterLimit, redThreshold);
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

      // Setup the character limit on pgae load
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
      observer.observe(observeTarget, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['value'],
      });

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
