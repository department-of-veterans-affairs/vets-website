import { LAST_ISSUE, REVIEW_ISSUES } from '../constants';

export const setStorage = (index, type, value = '') => {
  // set session storage of edited item. This enables focusing on the item
  // upon return to the eligible issues page (a11y); when -1 is set, the add
  // a new issue action link will be focused
  window.sessionStorage.setItem(LAST_ISSUE, value || `${index},${type}`);
  window.sessionStorage.removeItem(REVIEW_ISSUES);
};
