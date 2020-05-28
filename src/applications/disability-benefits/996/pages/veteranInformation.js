import veteranInfoDescription from '../content/veteranInformation';

const veteranInformation = {
  uiSchema: {
    'ui:description': veteranInfoDescription,
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
