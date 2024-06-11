import {
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

/** @type {PageSchema} */
export default {
  title: 'Claimant type',
  path: 'claimant/type',
  uiSchema: {
    claimantType: radioUI({
      title: 'What is the type of claimant?',
      labels: {
        veteran: 'Veteran',
        survivingSpouse: 'Surviving spouse',
        survivingChild: 'Surviving child',
        parent: 'Parent',
        custodian: 'Custodian of child beneficiary',
      },
      errorMessages: {
        required: 'Please select a type',
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['claimantType'],
    properties: {
      claimantType: radioSchema([
        'veteran',
        'survivingSpouse',
        'survivingChild',
        'parent',
        'custodian',
      ]),
    },
  },
};
