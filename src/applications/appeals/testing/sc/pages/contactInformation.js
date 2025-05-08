import profileContactInfo from '@department-of-veterans-affairs/platform-forms-system/profileContactInfo';
import { getContent } from '@department-of-veterans-affairs/platform-forms-system/utilities/data/profile.js';

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
