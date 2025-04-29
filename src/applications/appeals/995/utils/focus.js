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
    focusReview(
      name, // name of scroll element
      true, // review accordion in edit mode
      true, // reviewEditFocusOnHeaders setting from form/config.js
    );
  } else {
    scrollTo('topContentElement');
    focusElement('h3#header');
  }
};
