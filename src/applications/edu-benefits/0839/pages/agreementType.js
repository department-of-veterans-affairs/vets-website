import {
  radioUI,
  radioSchema,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const agreementTypeOptions = {
  startNewOpenEndedAgreement: 'Start a new open-ended agreement',
  modifyExistingAgreement: 'Modify an existing agreement',
  withdrawFromYellowRibbonProgram: 'Withdraw from Yellow Ribbon agreement',
};

const uiSchema = {
  ...titleUI('Yellow Ribbon agreement type'),
  agreementType: {
    ...radioUI({
      title: 'What would you like to do with your Yellow Ribbon agreement?',
      required: () => true,
      labels: agreementTypeOptions,
      errorMessages: {
        required: 'Please make a selection',
      },
    }),
  },
};

const schema = {
  type: 'object',
  properties: {
    agreementType: radioSchema(Object.keys(agreementTypeOptions)),
  },
  required: ['agreementType'],
};

export { schema, uiSchema };
