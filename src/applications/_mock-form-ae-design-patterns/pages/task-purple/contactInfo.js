import profileContactInfo from 'platform/forms-system/src/js/definitions/profileContactInfo';
import set from 'platform/utilities/data/set';
import { getContent } from 'platform/forms-system/src/js/utilities/data/profile';

import { contactInfoValidation } from '../../validations/contactInfo';

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
