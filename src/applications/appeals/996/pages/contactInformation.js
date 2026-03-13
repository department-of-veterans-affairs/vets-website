import profileContactInfo from 'platform/forms-system/src/js/definitions/profileContactInfo';
import set from 'platform/utilities/data/set';
import { newContactPagesActive } from '../../shared/utils';
import { CONTACT_INFO_PATH } from '../constants';
import { contactInfoValidation } from '../../shared/validations/contactInfo';

const allContacts = ['address', 'email', 'phone'];

export default profileContactInfo({
  contactPath: `${CONTACT_INFO_PATH}-v0`,
  contactInfoPageKey: 'confirmContactInfoV0',
  contactInfoRequiredKeys: [],
  included: allContacts,
  addressKey: 'address',
  mobilePhoneKey: 'phone',
  // Explicit default ensures getDefaultFormState returns '' instead of undefined,
  // so lodash merge overwrites the new pages' email object default during
  // createInitialState (merge skips undefined values).
  emailSchema: { type: 'string', default: '' },
  contactInfoUiSchema: {
    'ui:options': {
      updateSchema: (formData = {}, schema) =>
        set(
          'properties.veteran.required',
          formData?.homeless ? ['email', 'phone'] : allContacts,
          schema,
        ),
    },
    'ui:required': () => true,
    'ui:validations': [contactInfoValidation],
  },
  depends: formData => !newContactPagesActive(formData),
});
