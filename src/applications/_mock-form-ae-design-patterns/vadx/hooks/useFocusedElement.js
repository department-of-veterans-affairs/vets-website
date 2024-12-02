import React, { useState, useEffect, useRef } from 'react';

/**
 * Creates a friendly, human-readable string for a DOM element
 * combines tag name, ID, classes, and truncated text content.
 *
 * @param {HTMLElement} element - The DOM element to create a selector for
 * @param {number} [truncateInnerTextLength] - The maximum length of the inner text to display default 30
 * @returns {string} A concatenated string of element identifiers
 *
 * @example
 * // Returns "button.primary"Hello World""
 * getFriendlySelector(document.querySelector('button.primary'))
 */
const getFriendlySelector = (element, truncateInnerTextLength = 30) => {
  const parts = [];

  if (element.tagName) {
    parts.push(element.tagName.toLowerCase());
  }

  if (element.id) {
    parts.push(`#${element.id}`);
  }
  if (element.className && typeof element.className === 'string') {
    // for multiple classes, join them with dots
    parts.push(`.${element.className.split(' ').join('.')}`);
  }

  // Add truncated text content if present
  if (element.textContent) {
    const trimmedText = element.textContent.trim();
    if (trimmedText.length > truncateInnerTextLength) {
      parts.push(`"${trimmedText.slice(0, truncateInnerTextLength)}..."`);
    } else {
      parts.push(`"${trimmedText}"`);
    }
  }

  return parts.join('');
};

/**
 * React hook that tracks the currently focused element in the DOM
 * and can help to highlight focused element on hover.
 *
 * @returns {Object} An object containing:
 *   - displayString: A user friendly selector string for the focused element
 *   - onMouseEnter: Function to handle mouse enter events and highlight the element
 *   - onMouseLeave: Function to handle mouse leave events and remove highlighting
 *
 * @example
 * function MyComponent() {
 *   const { displayString, onMouseEnter, onMouseLeave } = useFocusedElement();
 *   return (
 *     <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
 *       Currently focused: {displayString}
 *     </div>
 *   );
 * }
 */
export function useFocusedElement() {
  const [focusedElement, setFocusedElement] = useState({
    element: null,
    displayString: '',
  });

  // Storing cleanup func as a ref to avoid unnecessary re-renders
  const cleanupRef = useRef(null);

  const cleanupHighlight = () => {
    if (cleanupRef.current) {
      // Cleans up by restoring original styles
      // if a cleanup function is stored in the ref
      cleanupRef.current();
      cleanupRef.current = null;
    }
  };

  useEffect(() => {
    const handleFocus = () => {
      const element = document.activeElement;
      if (element && element !== document.body) {
        // cleanup needed to remove previous highlights in case
        // there was an edge case where the highlight was not removed
        cleanupHighlight();
        setFocusedElement({
          element,
          displayString: getFriendlySelector(element),
        });
      }
    };

    const handleBlur = () => {
      cleanupHighlight();
      setFocusedElement({
        element: null,
        displayString: '',
      });
    };

    document.addEventListener('focusin', handleFocus);
    document.addEventListener('focusout', handleBlur);

    // Cleanup function to remove event listeners and highlights
    return () => {
      cleanupHighlight();
      document.removeEventListener('focusin', handleFocus);
      document.removeEventListener('focusout', handleBlur);
    };
  }, []);

  return {
    displayString: focusedElement.displayString,

    onMouseEnter: () => {
      if (focusedElement.element) {
        cleanupHighlight();

        const { element } = focusedElement;
        // Store original styles
        const previousBackground = element.style.backgroundColor;
        const previousOutline = element.style.outline;

        // Apply highlight styles
        // TODO: make these colors more subtle or align with VADS better
        element.style.backgroundColor = 'rgba(255, 255, 0, 0.3)';
        element.style.outline = '2px solid #007AFF';

        // Store cleanup function in ref to restore original styles
        cleanupRef.current = () => {
          element.style.backgroundColor = previousBackground;
          element.style.outline = previousOutline;
        };
      }
    },

    onMouseLeave: () => {
      cleanupHighlight();
    },
  };
}

/**
 * Example component demonstrating usage of the useFocusedElement hook
 * Displays the currently focused element and highlights it on hover
 */
export const FocusDebugger = () => {
  const { displayString, onMouseEnter, onMouseLeave } = useFocusedElement();

  return (
    <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {displayString || 'No element focused'}
    </div>
  );
};
