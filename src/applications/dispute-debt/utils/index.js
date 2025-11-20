import { addDays, parse, parseISO, isValid } from 'date-fns';
import { formatDateLong } from 'platform/utilities/date';
import {
  focusElement,
  scrollTo,
  scrollToFirstError,
} from '~/platform/utilities/ui';
import { $ } from '~/platform/forms-system/src/js/utilities/ui';

import { deductionCodes } from '../constants';

export const focusFirstError = (_index, root) => {
  const error = $('[error], .usa-input-error', root);
  if (error) {
    scrollToFirstError({ focusOnAlertRole: true });
    return true;
  }
  return false;
};

export const focusH3 = (index, root) => {
  scrollTo('topContentElement');
  if (!focusFirstError(index, root)) {
    focusElement('#main h3');
  }
};

/**
 * parseDateToDateObj from ISO8601 or JS number date (not unix time)
 * @param {string, number, Date} date - date to format
 * @returns {dateObj|null} date object
 */
export const parseDateToDateObj = (date, template) => {
  let newDate = date;
  if (typeof date === 'string') {
    if (date.includes('T')) {
      newDate = parseISO((date || '').split('T')[0]);
    } else if (template) {
      newDate = parse(date, template, new Date());
    }
  } else if (date instanceof Date && isValid(date)) {
    // Remove timezone offset - the only time we pass in a date object is for
    // unit tests (see https://stackoverflow.com/a/67599505)
    newDate.setMinutes(newDate.getMinutes() + newDate.getTimezoneOffset());
  }
  return isValid(newDate) ? newDate : null;
};

export const endDate = (date, days) => {
  return isValid(new Date(date))
    ? formatDateLong(addDays(new Date(date), days))
    : '';
};

export const currency = amount => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
  const value =
    typeof amount === 'number'
      ? amount
      : parseFloat(amount?.replaceAll(/[^0-9.-]/g, '') ?? 0);
  return formatter.format(value);
};

export const setFocus = selector => {
  const el =
    typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (el) {
    el.setAttribute('tabIndex', -1);
    el.focus();
  }
};

/**
 * Get debt page title for form configuration
 * @param {Object} formData - The form data object
 * @param {Object} options - Options object with pagePerItemIndex
 * @returns {string} The debt page title
 */
export const getDebtPageTitle = (formData, { pagePerItemIndex } = {}) => {
  const debt = formData?.selectedDebts?.[pagePerItemIndex];
  if (!debt) {
    return `Debt ${parseInt(pagePerItemIndex, 10) + 1} of ${formData
      ?.selectedDebts?.length || 0}`;
  }

  // Use the existing label if available
  if (debt.label) {
    const total = formData?.selectedDebts?.length || 0;
    const debtNumber = parseInt(pagePerItemIndex, 10) + 1;
    return `Debt ${debtNumber} of ${total}: ${debt.label}`;
  }

  // Fallback to constructing the title
  const amount = debt.currentAr || debt.originalAr || 0;
  const debtTitle = deductionCodes[debt.deductionCode] || 'VA debt';
  const total = formData?.selectedDebts?.length || 0;
  const debtNumber = parseInt(pagePerItemIndex, 10) + 1;

  return `Debt ${debtNumber} of ${total}: ${currency(amount)} for ${debtTitle}`;
};

export const setDocumentTitle = title => {
  document.title = `${title} | Veterans Affairs`;
};
