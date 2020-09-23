import VeteranInfoDescription from '../content/VeteranInformation';

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
