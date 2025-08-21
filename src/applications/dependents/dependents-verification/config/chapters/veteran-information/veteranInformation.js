import VeteranInformation from '../../../components/VeteranInformationComponent';

export const veteranInformation = {
  schema: {
    type: 'object',
    properties: {
      veteranInformation: {
        type: 'object',
        properties: {},
      },
    },
  },
  uiSchema: {
    'ui:description': VeteranInformation,
    'ui:options': {
      hideOnReview: true,
    },
  },
};
