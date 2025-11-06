import {
  yesNoSchema,
  yesNoUI,
  titleUI,
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Legal status of marriage',
  path: 'household/legal-status-of-marriage',
  uiSchema: {
    ...titleUI('Legal status of marriage'),
    awareOfLegalIssues: yesNoUI({
      title:
        'At the time of your marriage to the Veteran, were you aware of any reason the marriage might not be legally valid?',
    }),
    legalIssueExplanation: {
      ...textUI({
        title: 'Tell us why your marriage might not be legally valid',
        required: formData => formData.awareOfLegalIssues === true,
      }),
      'ui:options': {
        expandUnder: 'awareOfLegalIssues',
        expandUnderCondition: true,
      },
    },
  },
  schema: {
    type: 'object',
    required: ['awareOfLegalIssues'],
    properties: {
      awareOfLegalIssues: yesNoSchema,
      legalIssueExplanation: textSchema,
    },
  },
};
