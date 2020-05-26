import titleCase from 'platform/utilities/data/titleCase';

export const makeTitle = text => titleCase(text.toLowerCase());

// testing
export const $ = (selector, DOM) => DOM.querySelector(selector);
export const $$ = (selector, DOM) => DOM.querySelectorAll(selector);
