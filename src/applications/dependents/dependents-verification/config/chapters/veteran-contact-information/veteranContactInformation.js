// import ContactInformationPage from '../../../components/ContactInformationPage';

export const veteranContactInformation = {
  schema: {
    type: 'object',
    properties: {
      veteranContactInformation: {
        type: 'object',
        properties: {},
      },
    },
  },
  uiSchema: {
    veteranContactInformation: {
      // 'ui:description': ContactInformationPage,
      'ui:options': {
        hideOnReview: true,
      },
    },
  },
};
