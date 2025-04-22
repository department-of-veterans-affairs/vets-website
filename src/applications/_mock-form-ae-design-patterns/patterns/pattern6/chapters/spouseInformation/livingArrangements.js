import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

export default {
  title: 'Living Arrangements',
  path: 'spouse-information/living-arrangements',
  depends: formData => formData?.maritalStatus === 'MARRIED',
  uiSchema: {
    ...titleUI('Living Arrangements'),
    liveWithSpouse: {
      'ui:title':
        'Did you live with your spouse for any part of the previous year?',
      'ui:widget': 'yesNo',
    },
    reasonNotLivingWithSpouse: {
      'ui:title': 'Reason you live separately from your spouse',
      'ui:widget': 'radio',
      'ui:options': {
        expandUnder: 'liveWithSpouse',
        expandUnderCondition: false,
        labels: {
          HEALTH_CARE:
            'ONE OF US NEEDS TO BE IN A NURSING HOME OR MEDICAL FACILITY FOR CARE',
          WORK_LOCATION: 'ONE OF US NEEDS TO LIVE IN A SPECIFIC WORK LOCATION',
          RELATIONSHIP_ISSUES:
            'WE’RE EXPERIENCING RELATIONSHIP DIFFERENCES OR PROBLEMS',
          NOT_LISTED_HERE: 'Not listed here',
        },
      },
    },
    otherReasonDescription: {
      'ui:title': 'BRIEFLY DESCRIBE WHY YOU LIVE SEPARATELY FROM YOUR SPOUSE',
      'ui:options': {
        expandUnder: 'reasonNotLivingWithSpouse',
        expandUnderCondition: 'Not listed here',
      },
    },
  },
  schema: {
    type: 'object',
    required: ['liveWithSpouse'],
    properties: {
      liveWithSpouse: { type: 'boolean' },
      reasonNotLivingWithSpouse: {
        type: 'string',
        enum: ['HEALTH_CARE', 'WORK_LOCATION', 'RELATIONSHIP_ISSUES', 'OTHER'],
      },
      otherReasonDescription: { type: 'string' },
    },
  },
};
