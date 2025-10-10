// @ts-check
import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    isCurrentlyServing: yesNoUI({
      title: 'Are you currently serving in the Army Reserve or National Guard?',
      labelHeaderLevel: '1',
      errorMessages: {
        required:
          'Select if you are currently serving in the Army Reserve or National Guard',
      },
    }),
    militaryDutiesImpacted: yesNoUI({
      title:
        'Does your service-connected disability prevent you from performing your military duties?',
      expandUnder: 'isCurrentlyServing',
      expandUnderCondition: true,
      errorMessages: {
        required:
          'Select if your service-connected disability prevents you from performing your military duties',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      isCurrentlyServing: yesNoSchema,
      militaryDutiesImpacted: yesNoSchema,
    },
    required: ['isCurrentlyServing'],
  },
};
