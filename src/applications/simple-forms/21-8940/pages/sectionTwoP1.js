import {
  textUI,
  textSchema,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Disability and Medical Information',
    'ui:description':
      'Please provide information about your disability and medical care.',

    disabilityDescription: textUI(
      'What service-connected disability(ies) prevent(s) you from securing or following any substantially gainful occupation?',
    ),

    /*doctorCare: yesNoUI({
      title:
        "Have you been under a doctor's care and/or hospitalized within the past 12 months?",
      labels: {
        Y: 'Yes',
        N: 'No',
      },
    }),*/
  },
  schema: {
    type: 'object',
    properties: {
      disabilityDescription: textSchema,
      /*doctorCare: yesNoSchema,*/
    },
    required: ['disabilityDescription'/*, 'doctorCare'*/],
  },
};
