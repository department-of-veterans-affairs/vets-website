import {
  titleUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'National Guard service',
  path: 'veteran/national-guard-service',
  uiSchema: {
    ...titleUI('National Guard service'),
    nationalGuardActivated: yesNoUI({
      title:
        'Was the Veteran activated to Federal or Active Duty under authority of title 10, U.S.C. (National Guard)?',
    }),
  },
  schema: {
    type: 'object',
    required: ['nationalGuardActivated'],
    properties: {
      nationalGuardActivated: yesNoSchema,
    },
  },
};
