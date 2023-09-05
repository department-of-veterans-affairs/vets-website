import {
  focusElement,
  waitForRenderThenFocus,
  scrollTo,
} from 'platform/utilities/ui';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

export const scrollAndFocusTarget = () => {
  scrollTo('topScrollElement');
  const radio = $('va-radio');
  if (radio) {
    setTimeout(() => {
      waitForRenderThenFocus('h1', radio.shadowRoot);
    });
    // va-radio content doesn't immediately render
  } else {
    focusElement('h1');
  }
};
