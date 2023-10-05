import profileContactInfo from 'platform/forms-system/src/js/definitions/profileContactInfo';
import set from 'platform/utilities/data/set';
import { getContent } from 'platform/forms-system/src/js/utilities/data/profile.js';

import { contactInfoValidation } from '../../shared/validations/contactInfo';

const allContacts = ['mobilePhone', 'homePhone', 'address', 'email'];
const homelessContacts = ['mobilePhone', 'homePhone', 'email'];

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
          formData.homeless ? homelessContacts : allContacts,
          schema,
        ),
    },
    'ui:required': () => true,
    'ui:validations': [contactInfoValidation],
  },
});
