import { textareaUI } from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';

import { content } from '../content/evidencePrivateLimitation';

export default {
  uiSchema: {
    limitedConsent: textareaUI({
      title: content.textAreaTitle,
      hint: content.textAreaHint,
      labelHeaderLevel: 3,
      classNames: 'vads-u-margin-bottom--4',
      required: () => true,
      hideOnReview: true,
      errorMessages: {
        required: content.errorMessage,
      },
    }),
  },
  schema: {
    required: ['limitedConsent'],
    type: 'object',
    properties: {
      limitedConsent: {
        type: 'string',
      },
    },
  },
};
