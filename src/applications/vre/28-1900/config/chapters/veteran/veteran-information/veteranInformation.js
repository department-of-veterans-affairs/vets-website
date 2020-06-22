import VeteranInformation from '../../../../containers/VeteranInformation';

export const schema = {
  type: 'object',
  properties: {
    veteranInformation: {
      type: 'object',
      properties: {},
    },
  },
};

export const uiSchema = {
  veteranInformation: {
    'ui:title': 'Veteran Information',
    'ui:field': 'StringField',
    'ui:widget': VeteranInformation,
  },
};
