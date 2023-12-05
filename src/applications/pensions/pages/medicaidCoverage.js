import {
  yesNoSchema,
  yesNoUI,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Medicaid coverage',
    medicaidCoverage: yesNoUI({
      title: 'Does Medicaid cover all or part of your nursing home costs?',
      uswds: true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      medicaidCoverage: yesNoSchema,
    },
  },
};
