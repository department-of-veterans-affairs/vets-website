import MockVeteranInformation from '../components/_MockVeteranInformation';

const veteranInformation = {
  uiSchema: {
    'ui:description': MockVeteranInformation,
    'ui:options': {
      hideOnReview: true,
    },
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

export default veteranInformation;
