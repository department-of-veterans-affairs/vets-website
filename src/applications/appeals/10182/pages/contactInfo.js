import profileContactInfo from 'platform/forms-system/src/js/definitions/profileContactInfo';
import set from 'platform/utilities/data/set';
import { getContent } from 'platform/forms-system/src/js/utilities/data/profile';
import { newContactPagesActive } from '../../shared/utils';
import { contactInfoValidation } from '../../shared/validations/contactInfo';

const allContacts = ['address', 'email', 'phone'];

export default profileContactInfo({
  content: getContent('appeal'),
  contactInfoPageKey: 'confirmContactInfoV0',
  contactPath: 'contact-information-v0',
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
  depends: formData => !newContactPagesActive(formData),
});
