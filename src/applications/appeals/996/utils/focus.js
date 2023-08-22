import {
  focusElement,
  scrollTo,
  scrollToTop,
  defaultFocusSelector,
  waitForRenderThenFocus,
} from 'platform/utilities/ui';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

export const focusRadioH3 = () => {
  scrollToTop();
  const radio = $('va-radio');
  if (radio) {
    // va-radio content doesn't immediately render
    waitForRenderThenFocus('h3', radio.shadowRoot);
  } else {
    focusElement(defaultFocusSelector);
  }
};

export const focusAlertH3 = () => {
  scrollTo('h3');
  // va-alert header is not in the shadow DOM, but still the content doesn't
  // immediately render
  waitForRenderThenFocus('h3');
};
