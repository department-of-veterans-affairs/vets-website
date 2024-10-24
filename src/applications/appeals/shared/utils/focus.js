import {
  defaultFocusSelector,
  focusElement,
  focusByOrder,
  scrollTo,
  scrollToFirstError,
  waitForRenderThenFocus,
  scrollAndFocus,
} from '~/platform/utilities/ui';
import { focusReview } from '~/platform/forms-system/src/js/utilities/ui/focus-review';
import { $, $$ } from '~/platform/forms-system/src/js/utilities/ui';

import { LAST_ISSUE } from '../constants';

export const focusFirstError = (root = document) => {
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

// Focus on upload file card instead of delete button
export const focusFileCard = (name, root) => {
  const target = $$('.schemaform-file-list li', root).find(entry =>
    $('strong', entry)
      .textContent?.trim()
      .includes(name),
  );
  if (target) {
    scrollTo(target.id);
    setTimeout(() => {
      const select = $('va-select', target); // SC only
      if (select) {
        // Set focusElement root parameter to a string because internally,
        // focusElement will wait for shadow DOM to render before attempting to
        // find the 'select' target
        focusElement('select', {}, `#${target.id} va-select`);
      } else {
        focusElement(target);
      }
    });
  }
};

// Focus on add another button after deleting & after removing all files
export const focusAddAnotherButton = root => {
  // Add a timeout to allow for the upload button to reappear in the DOM
  // before trying to focus on it
  setTimeout(() => {
    scrollTo($('#upload-wrap', root));
    // focus on upload button, not the label
    focusElement(
      // including `#upload-button` because RTL can't access the shadowRoot
      'button, #upload-button',
      {},
      $(`#upload-button`, root)?.shadowRoot,
    );
  }, 100);
};

// Focus on the 'Cancel' button when a file is being uploaded
export const focusCancelButton = root => {
  setTimeout(() => {
    const cancel = $('.schemaform-file-uploading .cancel-upload', root);
    if (cancel) {
      focusElement(
        'button', // in shadow DOM
        {},
        cancel?.shadowRoot,
      );
    }
  }, 100);
};

export const focusRadioH3 = () => {
  scrollTo('topContentElement');
  const radio = $('va-radio, va-checkbox-group');
  if (radio) {
    // va-radio content doesn't immediately render
    waitForRenderThenFocus('h3', radio.shadowRoot);
  } else {
    focusByOrder(['#main h3', defaultFocusSelector]);
  }
};

// Testing focus on role="alert" inside web components
export const focusH3OrRadioError = () => {
  scrollTo('topContentElement');
  const radio = $('va-radio, va-checkbox-group');
  const hasError = radio.getAttribute('error');
  const target = hasError ? '[role="alert"]' : 'h3';
  const root = hasError ? radio.shadowRoot : document;
  waitForRenderThenFocus(target, root);
};

// Temporary focus function for HLR homlessness question (page header is
// dynamic); once 100% released, change homeless form config to use
// `scrollAndFocusTarget: focusH3`
export const focusToggledHeader = () => {
  scrollTo('topContentElement');
  const radio = $('va-radio');
  if ((sessionStorage.getItem('hlrUpdated') || 'false') === 'false' && radio) {
    waitForRenderThenFocus('h3', radio.shadowRoot);
  } else {
    waitForRenderThenFocus('#main h3');
  }
};

export const focusH3 = () => {
  scrollTo('topContentElement');
  focusElement('#main h3');
};

export const focusAlertH3 = () => {
  scrollTo('topContentElement');
  // va-alert header is not in the shadow DOM, but still the content doesn't
  // immediately render
  waitForRenderThenFocus('#main h3');
};

// Used for onContinue callback on the contestable issues page
export const focusOnAlert = () => {
  const alert = $('va-alert[status="error"] h3');
  if (alert) {
    scrollAndFocus(alert);
  }
};
