import {
  focusElement,
  scrollTo,
  scrollToFirstError,
} from 'platform/utilities/ui';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

let timer;
export const focusEvidence = (_index, root) => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    const error = $('[error]', root);
    timer = null;
    if (document.activeElement === document.body) {
      if (error) {
        scrollToFirstError();
        focusElement(error);
      } else {
        scrollTo('topContentElement');
        focusElement('#main h3', null, root);
      }
    }
  });
};
