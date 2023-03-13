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
  if (item) {
    const [id, type] = item.split(',');
    scrollTo(`#issue-${id}`);
    if (type === 'updated') {
      waitForRenderThenFocus(`#root_contestedIssues_${id}`);
      // id="root_contestedIssues_0" name="root_contestedIssues_0">
      // input isn't working
    } else {
      focusElement('.edit-issue-link');
    }

    window.sessionStorage.removeItem(LAST_SC_ITEM);
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
