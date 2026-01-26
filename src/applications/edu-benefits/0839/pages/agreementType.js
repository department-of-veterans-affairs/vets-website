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

const updateFormData = (oldData, formData) => {
  const prev = oldData?.agreementType;
  const curr = formData?.agreementType;

  if (prev !== curr) {
    return {
      authorizedOfficial: oldData?.authorizedOfficial,
      agreementType: curr,
      acknowledgements: {},
      institutionDetails: {},
      additionalInstitutionDetails: [],
      yellowRibbonProgramRequest: [],
      pointsOfContact: {},
    };
  }

  return formData;
};

export { uiSchema, schema, updateFormData };
