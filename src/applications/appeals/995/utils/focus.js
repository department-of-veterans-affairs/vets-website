import {
  focusElement,
  scrollTo,
  scrollToTop,
  defaultFocusSelector,
  waitForRenderThenFocus,
} from 'platform/utilities/ui';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { LAST_SC_ITEM } from '../constants';

export const focusIssue = () => {
  const item = window.sessionStorage.getItem(LAST_SC_ITEM);
  window.sessionStorage.removeItem(LAST_SC_ITEM);

  if (item < 0) {
    // focus on add new issue after removing or cancelling adding a new issue
    scrollTo('.add-new-issue');
    focusElement('.add-new-issue');
  } else if (item) {
    const [id, type] = item.split(',');
    scrollTo(`#issue-${id}`);
    if (type === 'updated') {
      waitForRenderThenFocus(`#issue-${id} input`);
    } else {
      focusElement(`#issue-${id} .edit-issue-link`);
    }
  } else {
    scrollToTop();
    focusElement('h3');
  }
};

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
  scrollToTop();
  // va-alert header is not in the shadow DOM, but still the content doesn't
  // immediately render
  waitForRenderThenFocus('h3');
};
