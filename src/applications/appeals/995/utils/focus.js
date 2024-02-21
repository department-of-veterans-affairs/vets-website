import {
  focusElement,
  scrollTo,
  scrollToFirstError,
} from 'platform/utilities/ui';
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
    scrollTo('topContentElement');
    focusElement('#main h3', null, root);
  }
};
