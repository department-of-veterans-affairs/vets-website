/**
 * Adapter — platform/utilities re-exports.
 *
 * Consolidates every import that forms-system or forms uses from
 * platform/utilities so there is exactly one file to replace when
 * the package is extracted.
 */

// --- data helpers ---
export { default as get } from 'platform/utilities/data/get';
export { default as set } from 'platform/utilities/data/set';
export { default as omit } from 'platform/utilities/data/omit';
export { default as unset } from 'platform/utilities/data/unset';
export { default as debounce } from 'platform/utilities/data/debounce';

// --- constants ---
export {
  ERROR_ELEMENTS,
  SCROLL_ELEMENT_SUFFIX,
  FOCUSABLE_ELEMENTS,
} from 'platform/utilities/constants';

// --- environment ---
export { default as environment } from 'platform/utilities/environment';

// --- storage ---
export { default as localStorage } from 'platform/utilities/storage/localStorage';

// --- ui helpers ---
export {
  isReactComponent,
  displayFileSize,
  formatSSN,
  formatARN,
} from 'platform/utilities/ui';
export {
  focusElement,
  focusByOrder,
  defaultFocusSelector,
  waitForRenderThenFocus,
} from 'platform/utilities/ui/focus';

// --- scroll helpers ---
export {
  Element as ScrollElement,
  scrollTo,
  scrollAndFocus,
  scrollToTop,
  scrollToFirstError,
  customScrollAndFocus,
  getScrollOptions,
  watchErrorUpdates,
} from 'platform/utilities/scroll';

// --- OAuth ---
export {
  infoTokenExists,
  refresh as refreshOAuth,
} from 'platform/utilities/oauth/utilities';

// --- React hooks ---
export { usePrevious } from 'platform/utilities/react-hooks';

// --- date ---
export { timeFromNow, dateFieldToDate } from 'platform/utilities/date';

// --- api ---
export { handleSessionUpdates } from 'platform/utilities/api';

// --- registry ---
export { getAppUrl } from 'platform/utilities/registry-helpers';

// --- data (lodash-like namespace) ---
export { default as dataUtils } from 'platform/utilities/data';

