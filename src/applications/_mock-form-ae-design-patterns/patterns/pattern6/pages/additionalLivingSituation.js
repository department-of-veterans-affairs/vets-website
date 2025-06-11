// const FinancialSupportDescription = (
//   <va-additional-info
//     trigger="Why we consider financial support for a spouse (used by 10-10EZ)"
//     class="vads-u-margin-top--2 vads-u-margin-bottom--3"
//     uswds
//   >
//     <div>
//       <p className="vads-u-margin-top--0" />
//     </div>
//   </va-additional-info>
// );

export default {
  title: 'Additional Living Situation Information',
  path: 'additional-living-situation',
  // depends: formData => !formData?.currentlyLiveWithSpouse,
  uiSchema: {
    // ...titleUI('Additional living situation information'),
    reasonNotLivingWithSpouse: {
      'ui:title': 'Why do you live separately from your spouse?',
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          HEALTH_CARE: 'One of us needs medical care in a dedicated facility',
          RELATIONSHIP_ISSUES:
            'We’re experiencing relationship differences or problems',
          WORK_LOCATION: 'One of us needs to live in a specific work location',
          NOT_LISTED_HERE: 'Not listed here',
        },
      },
    },
    otherReasonDescription: {
      'ui:title':
        "Since your living situation wasn't listed, please describe why you live separately from your spouse.",
      'ui:widget': 'textarea',
      'ui:options': {
        rows: 5,
        expandUnder: 'reasonNotLivingWithSpouse',
        expandUnderCondition: 'NOT_LISTED_HERE',
      },
    },
    'ui:options': {
      updateSchema: (formData, formSchema) => {
        if (formSchema.properties.otherReasonDescription['ui:collapsed']) {
          return { ...formSchema, required: ['reasonNotLivingWithSpouse'] };
        }
        return {
          ...formSchema,
          required: ['reasonNotLivingWithSpouse', 'otherReasonDescription'],
        };
      },
    },
    // form527MonthlySpouseSupport: {
    //   'ui:title':
    //     '(Form 527 and 527EZ (if separated):) How much do you contribute to your spouse’s monthly support?',
    // },
    // form1010EZSpouseFinancialSupport: {
    //   'ui:title':
    //     '(Form 10-10EZ only:) Did you provide financial support for your spouse in the previous year even though you didn’t live together?',
    // },
    // 'view:financialSupportInfo': {
    //   'ui:description': FinancialSupportDescription,
    // },
  },
  schema: {
    type: 'object',
    required: ['reasonNotLivingWithSpouse'],
    properties: {
      reasonNotLivingWithSpouse: {
        type: 'string',
        enum: [
          'HEALTH_CARE',
          'RELATIONSHIP_ISSUES',
          'WORK_LOCATION',
          'NOT_LISTED_HERE',
        ],
      },
      otherReasonDescription: { type: 'string' },
      // form527MonthlySpouseSupport: { type: 'string' },
      // form1010EZSpouseFinancialSupport: { type: 'string' },
      // 'view:financialSupportInfo': {
      //   type: 'object',
      //   properties: {},
      // },
    },
  },
};
