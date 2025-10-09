import { textareaUI } from 'platform/forms-system/src/js/web-component-patterns';
import { content } from '../content/limitedConsent';

export default {
  uiSchema: {
    limitedConsent: textareaUI({
      title: content.detailsQuestion,
      hint: content.detailsHint,
      labelHeaderLevel: 3,
      classNames: 'vads-u-margin-bottom--4',
      required: () => true,
      hideOnReview: true,
      errorMessages: {
        required: content.detailsError,
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
