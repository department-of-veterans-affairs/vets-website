import profileContactInfo from '@department-of-veterans-affairs/platform-forms-system/profileContactInfo';
import { set } from '@department-of-veterans-affairs/platform-forms-system/exports';

import { contactInfoValidation } from '../validations';

const allContacts = ['address', 'email', 'phone'];

export default profileContactInfo({
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
