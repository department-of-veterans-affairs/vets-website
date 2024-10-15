import {
  defaultFocusSelector,
  focusElement,
  focusByOrder,
  scrollTo,
  scrollToFirstError,
  waitForRenderThenFocus,
  scrollAndFocus,
} from 'platform/utilities/ui';
import { focusReview } from 'platform/forms-system/src/js/utilities/ui/focus-review';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import { LAST_ISSUE } from '../../../shared/constants';

const focusFirstError = (root = document) => {
  const error = $('[error]', root);
  if (error) {
    scrollToFirstError({ focusOnAlertRole: true });
    return true;
  }
  return false;
};

export const focusEvidence = (_index, root) => {
  setTimeout(() => {
    if (!focusFirstError(root)) {
      scrollTo('topContentElement');
      focusElement('#main h3', null, root);
    }
  });
};

export const focusH3AfterAlert = ({
  name,
  onReviewPage,
  root = document,
} = {}) => {
  if (name && onReviewPage) {
    focusReview(
      name, // name of scroll element
      true, // review accordion in edit mode
      true, // reviewEditFocusOnHeaders setting from form/config.js
    );
  } else if (!focusFirstError(root)) {
    scrollTo('topContentElement');
    focusElement('h3#header', null, root);
  }
};

/*
  Modified focus from shared for testing:
    focusEvidence,
    focusAlertH3,
    focusRadioH3,
    focusH3,
    focusOnAlert,
    focusIssue,
 */

export const focusAlertH3 = (root = document) => {
  scrollTo('topContentElement');
  const alert = $('va-alert[visible="true"]', root);
  // va-alert header is not in the shadow DOM, but still the content doesn't
  // immediately render
  focusElement(`#main ${alert ? 'va-alert ' : ''}h3`);
};

export const focusRadioH3 = () => {
  scrollTo('topContentElement');
  const radio = $('va-radio, va-checkbox-group');
  if (radio) {
    const target = radio.getAttribute('error') ? '[role="alert"]' : 'h3';
    // va-radio content doesn't immediately render
    waitForRenderThenFocus(target, radio.shadowRoot);
  } else {
    focusByOrder(['#main h3', defaultFocusSelector]);
  }
};

export const focusH3 = (root = document) => {
  scrollTo('topContentElement');
  if (!focusFirstError(root)) {
    focusElement('#main h3');
  }
};

// Used for onContinue callback on the contestable issues page
export const focusOnAlert = () => {
  const alert = $('va-alert[status="error"] h3');
  if (alert) {
    scrollAndFocus(alert);
  }
};

export const focusIssue = (_index, root, value) => {
  setTimeout(() => {
    const item = value || window.sessionStorage.getItem(LAST_ISSUE);
    window.sessionStorage.removeItem(LAST_ISSUE);
    const [id, type] = (item || '').toString().split(',');
    if (id < 0) {
      // focus on add new issue after removing or cancelling adding a new issue
      scrollTo('add-new-issue');
      focusElement('.add-new-issue', null, root);
    } else if (id) {
      const card = $(`#issue-${id}`, root);
      scrollTo(`issue-${id}`);
      if (type === 'remove-cancel') {
        const remove = $('.remove-issue', card)?.shadowRoot;
        waitForRenderThenFocus('button', remove);
      } else if (type === 'updated') {
        waitForRenderThenFocus('input', card);
      } else {
        focusElement('.edit-issue-link', null, card);
      }
    } else {
      scrollTo('h3');
      focusElement('h3');
    }
  });
};
