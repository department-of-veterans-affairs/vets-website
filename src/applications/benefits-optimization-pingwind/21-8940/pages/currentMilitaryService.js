import {
  yesNoUI,
  yesNoSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Current Military Service'),
    'ui:description': 'Tell us about your current military service.',
    currentlyServing: yesNoUI({
      title: 'Are you currently serving in the Reserve or National Guard?',
      errorMessages: {
        required: 'Select a response to tell us if you are currently serving',
      },
    }),
    activeDutyOrders: yesNoUI({
      title:
        'Does your service-connected disability prevent you from performing your military duties?',
      expandUnder: 'currentlyServing',
      expandUnderCondition: true,
      required: formData => formData.currentlyServing === true,
      errorMessages: {
        required:
          'Select a response to tell us if your service-connected disabilities impact your military duties',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      currentlyServing: yesNoSchema,
      activeDutyOrders: yesNoSchema,
    },
    required: ['currentlyServing'],
  },
};
