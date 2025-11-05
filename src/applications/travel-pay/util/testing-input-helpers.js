/**
 * Simulates a VA text input change event and optionally calls the onInput handler.
 * @param {HTMLElement} inputField - The VA text input field element.
 * @param {string|number} value - The value to set for the input field.
 * @returns {{field: HTMLElement, value: string|number, eventFired: boolean}|null}
 *          An object containing the updated field, value, and confirmation that events were fired,
 *          or null if the inputField is not provided.
 */
export function simulateVaInputChange(inputField, value) {
  if (!inputField) return null;

  const field = inputField;

  field.value = value;

  // Dispatch standard VA input events
  field.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
  field.dispatchEvent(
    new CustomEvent('input', { detail: value, bubbles: true, composed: true }),
  );

  // Call the component's onInput handler if it exists
  if (typeof field.onInput === 'function') {
    field.onInput({ target: { value } });
  }

  return { field, value, eventFired: true };
}

/**
 * Simulates a VA date input change event and optionally calls the onDateChange handler.
 * @param {HTMLElement} dateField - The VA date input field element.
 * @param {string|Date} value - The date value to set for the field.
 * @returns {{field: HTMLElement, value: string|Date, eventFired: boolean}|null}
 *          An object containing the updated field, value, and confirmation that events were fired,
 *          or null if the dateField is not provided.
 */
export function simulateVaDateChange(dateField, value) {
  if (!dateField) return null;

  const field = dateField;
  field.value = value;

  // Dispatch standard VA date events
  field.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
  field.dispatchEvent(
    new CustomEvent('dateChange', {
      detail: value,
      bubbles: true,
      composed: true,
    }),
  );

  // Call the component's onDateChange handler if it exists
  if (typeof field.onDateChange === 'function') {
    field.onDateChange({ target: { value } });
  }

  return { field, value, eventFired: true };
}
