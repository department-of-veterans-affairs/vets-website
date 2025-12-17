// @ts-check
import {
  radioSchema,
  radioUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const Options = {
  chapter33:
    'Post-9/11 GI Bill Including Transfer of Entitlement and Fry Scholarship Recipients (Chapter 33)',
  chapter35:
    'Survivors’ and Dependents’ Educational Assistance Program (DEA) (Chapter 35)',
  chapter30:
    'Montgomery GI Bill - Active Duty Educational Assistance Program (MGIB) (Chapter 30)',
  chapter1606:
    'Montgomery GI Bill - Selected Reserve Educational Assistance Program (MGIB-SR) (Chapter 1606)',
};

const uiSchema = {
  ...titleUI('Select a VA benefit program'),
  vaBenefitProgram: {
    ...radioUI({
      title:
        'Which VA education benefit program are you using to request reimbursement for this test fee?',
      required: () => true,
      labels: Options,
    }),
  },
};
const schema = {
  type: 'object',
  properties: {
    vaBenefitProgram: radioSchema(Object.keys(Options)),
  },
  required: ['vaBenefitProgram'],
};

export { schema, uiSchema };
