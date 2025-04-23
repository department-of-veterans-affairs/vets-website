import { LAST_ISSUE, REVIEW_ISSUES } from '../constants';

export const setStorage = (
  index,
  type,
  value = '',
  storage = window.sessionStorage,
) => {
  // set session storage of edited item. This enables focusing on the item
  // upon return to the eligible issues page (a11y); when -1 is set, the add
  // a new issue action link will be focused
  storage.setItem(LAST_ISSUE, value || `${index},${type}`);
  storage.removeItem(REVIEW_ISSUES);
};

export const getStorage = (storage = window.sessionStorage) =>
  storage.getItem(LAST_ISSUE);

export const removeStorage = (storage = window.sessionStorage) =>
  storage.removeItem(LAST_ISSUE);
