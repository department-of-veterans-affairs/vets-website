import profileContactInfo from '@department-of-veterans-affairs/platform-forms-system/profileContactInfo';
import set from '@department-of-veterans-affairs/platform-utilities/data/set';
import { getContent } from '@department-of-veterans-affairs/platform-forms-system/utilities/data/profile.js';

import { contactInfoValidation } from '../../shared/validations/contactInfo';

const allContacts = ['address', 'email', 'phone'];

export default profileContactInfo({
  content: getContent('appeal'),
  contactInfoRequiredKeys: [],
  included: allContacts,
  addressKey: 'address',
  mobilePhoneKey: 'phone',
  contactInfoUiSchema: {
    'ui:options': {
      updateSchema: (formData, schema) =>
        set(
          'properties.veteran.required',
          formData.homeless ? ['phone', 'email'] : allContacts,
          schema,
        ),
    },
    'ui:required': () => true,
    'ui:validations': [contactInfoValidation],
  },
});
