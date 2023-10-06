import PersonalInformation from '../../../containers/form/PersonalInformation';

export const schema = {
  type: 'object',
  properties: {
    'view:informationOnFile': {
      type: 'object',
      properties: {},
    },
  },
};

export const uiSchema = {
  'view:informationOnFile': {
    'ui:field': PersonalInformation,
  },
};
