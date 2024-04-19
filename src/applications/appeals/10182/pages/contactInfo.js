import profileContactInfo from '~/platform/forms-system/src/js/definitions/profileContactInfo';
import set from '~/platform/utilities/data/set';
import { getContent } from '~/platform/forms-system/src/js/utilities/data/profile';

import { contactInfo2PhoneValidation } from '../../shared/validations/contactInfo';

const allContacts = ['mobilePhone', 'homePhone', 'address', 'email'];

export default profileContactInfo({
  content: getContent('appeal'),
  contactInfoRequiredKeys: [],
  included: allContacts,
  addressKey: 'address',
  contactInfoUiSchema: {
    'ui:options': {
      updateSchema: (formData, schema) =>
        set(
          'properties.veteran.required',
          formData.homeless
            ? ['mobilePhone', 'homePhone', 'email']
            : allContacts,
          schema,
        ),
    },
    'ui:required': () => true,
    'ui:validations': [contactInfo2PhoneValidation],
  },
});
