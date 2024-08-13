import profileContactInfo from 'platform/forms-system/src/js/definitions/profileContactInfo';
import { getContent } from 'platform/forms-system/src/js/utilities/data/profile.js';

import { contactInfo995Validation } from '../../../shared/validations/contactInfo';

const allContacts = ['mobilePhone', 'homePhone', 'address', 'email'];

export default profileContactInfo({
  content: getContent('appeal'),
  addressKey: 'address',
  // Override defaults because of addressKey change
  included: allContacts,
  contactInfoRequiredKeys: allContacts,
  contactInfoUiSchema: {
    'ui:required': () => true,
    'ui:validations': [contactInfo995Validation],
  },
});
