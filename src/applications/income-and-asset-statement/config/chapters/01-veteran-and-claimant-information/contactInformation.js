import ContactInformationPage from '../../../components/ContactInformationPage';
import { hasSession } from '../../../helpers';

/** @type {PageSchema} */
export default {
  title: 'Contact information',
  path: 'contact/information',
  depends: formData => formData?.claimantType === 'VETERAN' && hasSession(),
  uiSchema: {
    'ui:title': ' ',
    'ui:description': ContactInformationPage,
    'ui:required': () => true,
    'ui:options': {
      hideOnReview: true,
    },
  },
  schema: {
    type: 'object',
    properties: {},
  },
};
