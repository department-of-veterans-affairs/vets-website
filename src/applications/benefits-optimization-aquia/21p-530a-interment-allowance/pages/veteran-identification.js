import {
  ssnOrVaFileNumberUI,
  ssnSchema,
  vaFileNumberSchema,
  serviceNumberSchema,
  serviceNumberUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

const veteranInformationUI = () => {
  return {
    ...ssnOrVaFileNumberUI(),
    vaServiceNumber: serviceNumberUI('Service number'),
  };
};

const veteranInformationSchema = {
  type: 'object',
  properties: {
    ssn: ssnSchema,
    vaServiceNumber: serviceNumberSchema,
    vaFileNumber: vaFileNumberSchema,
  },
  required: ['ssn'],
};

export const veteranIdentificationPage = {
  uiSchema: {
    ...titleUI('Veteran’s identification information'),
    veteranInformation: veteranInformationUI(),
  },
  schema: {
    type: 'object',
    required: ['veteranInformation'],
    properties: {
      veteranInformation: veteranInformationSchema,
    },
  },
};
