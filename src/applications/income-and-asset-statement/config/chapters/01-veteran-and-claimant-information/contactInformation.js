import ContactInformation from '../../../components/ContactInformation';

/** @type {PageSchema} */
export default {
  title: 'Contact information',
  path: 'contact/information',
  depends: formData => {
    const hasSession = localStorage.getItem('hasSession') === 'true';
    return formData?.claimantType === 'VETERAN' && hasSession;
  },
  uiSchema: {
    'ui:description': ContactInformation,
    'ui:options': {
      hideOnReview: true,
    },
  },
  schema: {
    type: 'object',
    properties: {},
  },
};
