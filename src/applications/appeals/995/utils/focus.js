import {
  focusElement,
  scrollTo,
  scrollToTop,
  scrollToFirstError,
  defaultFocusSelector,
  waitForRenderThenFocus,
} from 'platform/utilities/ui';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import { LAST_SC_ITEM } from '../constants';

export const focusIssue = (_index, root) => {
  const item = window.sessionStorage.getItem(LAST_SC_ITEM);
  window.sessionStorage.removeItem(LAST_SC_ITEM);

  if (item < 0) {
    // focus on add new issue after removing or cancelling adding a new issue
    scrollTo('.add-new-issue');
    focusElement('.add-new-issue', null, root);
  } else if (item) {
    const [id, type] = item.split(',');
    scrollTo(`#issue-${id}`);
    if (type === 'updated') {
      waitForRenderThenFocus(`#issue-${id} input`, root);
    } else {
      focusElement(`#issue-${id} .edit-issue-link`, null, root);
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

export const focusH3 = () => {
  scrollToTop();
  // va-alert header is not in the shadow DOM, but still the content doesn't
  // immediately render
  waitForRenderThenFocus('h3');
};

export const focusEvidence = (_index, root) => {
  setTimeout(() => {
    const error = $('[error]', root);
    if (error) {
      scrollToFirstError();
      focusElement(error);
    } else {
      scrollTo('topPageElement');
      focusElement('#main h3', null, root);
    }
  });
};

export const focusUploads = (_index, root) => {
  const hash = window.location.hash || '';
  const index = hash.startsWith('#') ? parseInt(hash.substring(1), 10) : null;
  if (typeof index === 'number') {
    setTimeout(() => {
      scrollTo(`root_additionalDocuments_file_${index}`);
      focusElement(
        `#root_additionalDocuments_${index}_attachmentId`,
        null,
        root,
      );
    });
  } else {
    focusElement('#main h3', null, root);
  }
};
