import {
  focusElement,
  scrollTo,
  scrollToFirstError,
} from 'platform/utilities/ui';
import { focusReview } from 'platform/forms-system/src/js/utilities/ui/focus-review';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

export const focusEvidence = (_index, root) => {
  setTimeout(() => {
    const error = $('[error]', root);
    if (error) {
      scrollToFirstError();
      focusElement(error);
    } else {
      scrollTo('topContentElement');
      focusElement('#main h3', null, root);
    }
  });
};

export const focusH3AfterAlert = ({ name, onReviewPage } = {}) => {
  if (name && onReviewPage) {
    // name, editing (alert only visible in edit mode), reviewEditFocusOnHeaders
    const editing = true; // alert only visible in edit mode
    const reviewEditFocusOnHeaders = true; // from form/config.js setting
    focusReview(name, editing, reviewEditFocusOnHeaders);
  } else {
    scrollTo('topContentElement');
    focusElement('h3#header');
  }
};
