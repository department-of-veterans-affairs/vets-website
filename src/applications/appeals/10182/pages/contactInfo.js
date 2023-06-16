import profileContactInfo from 'platform/forms-system/src/js/definitions/profileContactInfo';
import set from 'platform/utilities/data/set';

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
