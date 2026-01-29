import {
  titleUI,
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  uiSchema: {
    ...titleUI('Benefit type'),
    claims: checkboxGroupUI({
      title: 'Select the benefits you want to file a claim for.',
      required: true,
      labels: {
        DIC: 'Dependency and Indemnity Compensation (DIC)',
        survivorsPension: 'Survivors Pension',
        accruedBenefits: 'Accrued benefits',
      },
    }),
  },
  schema: {
    type: 'object',
    required: [],
    properties: {
      claims: checkboxGroupSchema([
        'DIC',
        'survivorsPension',
        'accruedBenefits',
      ]),
    },
  },
};
