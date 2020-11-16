import VeteranInfoDescription from '../components/VeteranInformation';

const veteranInformation = {
  uiSchema: {
    'ui:description': VeteranInfoDescription,
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
