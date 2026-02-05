import {
  yesNoSchema,
  yesNoUI,
  titleUI,
  textUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Legal status of marriage',
  path: 'household/legal-status-of-marriage',
  uiSchema: {
    ...titleUI('Legal status of marriage'),
    validMarriage: yesNoUI({
      title:
        'At the time of your marriage to the Veteran, were you aware of any reason the marriage might not be legally valid?',
    }),
    marriageValidityExplanation: {
      ...textUI({
        title: 'Tell us why your marriage might not be legally valid',
        required: formData => formData.validMarriage === true,
      }),
      'ui:options': {
        expandUnder: 'validMarriage',
        expandUnderCondition: true,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['validMarriage'],
    properties: {
      validMarriage: yesNoSchema,
      marriageValidityExplanation: {
        type: 'string',
        maxLength: 256,
      },
    },
  },
};
