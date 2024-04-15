// TODO: Rename this to something that makes more sense
export const requestStates = {
  notCalled: 'not called',
  pending: 'pending',
  succeeded: 'succeeded',
  failed: 'failed',
};

export const SCROLL_ELEMENT_SUFFIX = 'ScrollElement';

// Focus on error message/component selectors
export const ERROR_ELEMENTS = [
  '.usa-input-error',
  'input-error-date',
  '[error]',
];

// List from https://html.spec.whatwg.org/dev/dom.html#interactive-content
export const FOCUSABLE_ELEMENTS = [
  '[href]',
  'button',
  'details',
  'input:not([type="hidden"])',
  'select',
  'textarea',
  /* focusable, but not tabbable */
  '[tabindex]:not([tabindex="-1"])',
  /* label removed from list, because you can't programmically focus it
    * unless it has a tabindex of 0 or -1; clicking on it shifts focus to the
    * associated focusable form element
    */
  // 'label[for]',
  /* focusable elements not used in our form system */
  // 'audio[controls]',
  // 'embed',
  // 'iframe',
  // 'img[usemap]',
  // 'object[usemap]',
  // 'video[controls]',
];
