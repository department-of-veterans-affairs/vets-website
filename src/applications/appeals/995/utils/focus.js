import {
  focusElement,
  scrollTo,
  scrollToFirstError,
} from '@department-of-veterans-affairs/platform-utilities/ui';
import { focusReview } from '@department-of-veterans-affairs/platform-forms-system/utilities/ui/focus-review';
import { $ } from '@department-of-veterans-affairs/platform-forms-system/ui';

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
