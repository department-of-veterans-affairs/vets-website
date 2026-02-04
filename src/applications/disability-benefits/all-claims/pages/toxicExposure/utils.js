import { useEffect } from 'react';
import { formatMonthYearDate } from '../../utils/dates';

// va-date only updates formData on blur. ForceFieldBlur ensures fields blur
// before submission so validation runs on current data.
const getCurrentYear = () => new Date().getFullYear();

/**
 * Schema pattern that accepts YYYY-MM, YYYY-XX, or YYYY-MM-DD for backward compatibility
 * This extends the platform's currentOrPastMonthYearDateSchema to also accept full dates
 * Day portion (if present) must be valid (01-31)
 */
export const monthYearDateSchemaWithFullDateSupport = {
  type: 'string',
  pattern: '^(\\d{4}|XXXX)-(0[1-9]|1[0-2]|XX)(-(0[1-9]|[12]\\d|3[01]))?$',
};

/**
 * Returns a ui:confirmationField function that formats partial dates (year-only,
 * month/year, full date) for the submission accordion so they don't show "Invalid Date".
 * @param {string} label - Label for the confirmation row (e.g., startDateApproximate)
 * @returns {Function} confirmationField(value) => { data, label }
 */
export const makeDateConfirmationField = label => value => {
  const formatted = formatMonthYearDate(value?.formData);
  return {
    data: formatted || 'Unknown',
    label,
  };
};

/**
 * Check if year input has invalid year range
 * @param {HTMLElement} yearInput - Year input element
 * @param {number} minYear - Minimum valid year
 * @param {number} maxYear - Maximum valid year
 * @returns {boolean} True if invalid year range found
 */
function checkInvalidYearRange(yearInput, minYear, maxYear) {
  if (!yearInput) return false;

  const yearShadow = yearInput.shadowRoot;
  if (!yearShadow) return false;

  const yearInputElement = yearShadow.querySelector('input');
  if (!yearInputElement) return false;

  const yearValue = yearInputElement.value?.trim();
  if (!yearValue) return false;

  const yearNum = Number(yearValue);
  if (!Number.isInteger(yearNum) || yearNum < minYear || yearNum > maxYear) {
    // Focus the year input to trigger validation
    yearInputElement.focus();
    setTimeout(() => {
      yearInputElement.blur();
    }, 0);
    return true;
  }

  return false;
}

/**
 * Check if month is selected but year is empty
 * @param {HTMLElement} monthSelect - Month select element
 * @param {HTMLElement} yearInput - Year input element
 * @returns {boolean} True if month-only input found
 */
function checkMonthOnlyInput(monthSelect, yearInput) {
  if (!monthSelect || !yearInput) return false;

  const monthShadow = monthSelect.shadowRoot;
  const yearShadow = yearInput.shadowRoot;
  if (!monthShadow || !yearShadow) return false;

  const monthSelectElement = monthShadow.querySelector('select');
  const yearInputElement = yearShadow.querySelector('input');
  if (!monthSelectElement || !yearInputElement) return false;

  const monthValue = monthSelectElement.value;
  const yearValue = yearInputElement.value?.trim();

  // If month is selected but year is empty, prevent submission
  if (monthValue && monthValue !== '' && !yearValue) {
    // Focus the year input to trigger validation
    yearInputElement.focus();
    setTimeout(() => {
      yearInputElement.blur();
    }, 0);
    return true;
  }

  return false;
}

/**
 * Check va-date components for invalid inputs (month-only or invalid year range)
 * @param {Array} components - Array of va-date components
 * @param {number} minYear - Minimum valid year
 * @param {number} maxYear - Maximum valid year
 * @returns {boolean} True if invalid input found
 */
function checkVaDateComponents(components, minYear, maxYear) {
  for (const component of components) {
    try {
      const { shadowRoot } = component;
      if (shadowRoot) {
        const monthSelect = shadowRoot.querySelector('va-select.select-month');
        const yearInput = shadowRoot.querySelector('va-text-input.input-year');

        // Check for invalid year range
        if (checkInvalidYearRange(yearInput, minYear, maxYear)) {
          return true;
        }

        // Check for month-only input
        if (checkMonthOnlyInput(monthSelect, yearInput)) {
          return true;
        }
      }
    } catch (error) {
      // Continue checking other components
    }
  }
  return false;
}

// Ensure every continue click blurs inputs,
// which triggers internal VA form field update logic
// Enhanced version for toxic exposure pages that use va-date components
export const ForceFieldBlur = () => {
  useEffect(() => {
    const handleClick = event => {
      const button = event.target;

      // Only handle submit buttons
      if (button.type !== 'submit') return;

      // Find the form containing this button
      const form = button.closest('form');
      if (!form) return;

      // Blur active element first
      document.activeElement?.blur?.();

      // Check va-date components within this form for invalid inputs synchronously
      const vaDateComponents = Array.from(form.querySelectorAll('va-date'));
      const minYear = 1900;
      const maxYear = getCurrentYear();

      const foundInvalid = checkVaDateComponents(
        vaDateComponents,
        minYear,
        maxYear,
      );

      if (foundInvalid) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    // Use event delegation on document to handle all submit buttons
    // This avoids issues with multiple instances and dynamic button creation
    document.addEventListener('click', handleClick, true); // Use capture phase

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, []);

  return null;
};
