import PersonalInformation from '../../../components/PersonalInformation';

/** @type {PageSchema} */
export default {
  title: 'Personal information',
  path: 'personal/information',
  depends: formData => {
    const hasSession = localStorage.getItem('hasSession') === 'true';
    return formData?.claimantType === 'VETERAN' && hasSession;
  },
  uiSchema: {
    'ui:description': PersonalInformation,
    'ui:options': {
      hideOnReview: true,
    },
  },
  schema: {
    type: 'object',
    properties: {},
  },
};
