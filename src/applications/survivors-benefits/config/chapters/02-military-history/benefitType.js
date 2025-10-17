import {
  titleUI,
  checkboxGroupUI,
  checkboxGroupSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Benefit type',
  path: 'applicant/benefit-type',
  uiSchema: {
    ...titleUI('Benefit type'),
    claims: checkboxGroupUI({
      title: 'Select the benefit you intend to file a claim for.',
      labels: {
        dependencyIndemnityComp:
          'Dependency and Indemnity Compensation (D.I.C)',
        survivorPension: 'Survivors Pension',
        accruedBenefits: 'Accrued Benefits',
      },
      required: false,
    }),
  },
  schema: {
    type: 'object',
    required: [],
    properties: {
      claims: checkboxGroupSchema([
        'dependencyIndemnityComp',
        'survivorPension',
        'accruedBenefits',
      ]),
    },
  },
};
