import ContactInformationPage from '../../../components/ContactInformationPage';

/** @type {PageSchema} */
export default {
  title: 'Contact information',
  path: 'contact/information',
  depends: formData => {
    const hasSession = localStorage.getItem('hasSession') === 'true';
    return formData?.claimantType === 'VETERAN' && hasSession;
  },
  uiSchema: {
    'ui:description': ContactInformationPage,
    'ui:options': {
      hideOnReview: true,
    },
  },
  schema: {
    type: 'object',
    properties: {},
  },
};
