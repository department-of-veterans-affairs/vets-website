import { textareaUI } from 'platform/forms-system/src/js/web-component-patterns';

export const detailsQuestion =
  'How should we limit our request for your medical information?';
export const detailsHint =
  'For example, you want your doctor to release only information for certain treatment dates or health conditions.';
export const detailsError = 'Tell us how to limit our request';

export default {
  uiSchema: {
    limitedConsent: textareaUI({
      title: detailsQuestion,
      hint: detailsHint,
      labelHeaderLevel: 3,
      classNames: 'vads-u-margin-bottom--4',
      required: () => true,
      hideOnReview: true,
      errorMessages: {
        required: detailsError,
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
