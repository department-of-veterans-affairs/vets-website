import {
  focusElement,
  waitForRenderThenFocus,
  scrollTo,
} from '@department-of-veterans-affairs/platform-utilities/ui';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

export const scrollAndFocusTarget = () => {
  // May switch to topScrollElement (form ID at top), but using
  // topNavScrollElement (between form ID and top navigation links) to better
  // keep h1 in view
  scrollTo('topNavScrollElement');
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
