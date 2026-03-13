import { profileContactInfoPages } from 'platform/forms-system/src/js/patterns/prefill';
import set from 'platform/utilities/data/set';
import { CONTACT_INFO_PATH } from '../constants';
import { contactInfoValidation } from '../../shared/validations/contactInfo';
import { newContactPagesActive } from '../../shared/utils';

const allContacts = ['address', 'email', 'phone'];

export default profileContactInfoPages({
  contactPath: CONTACT_INFO_PATH,
  contactInfoRequiredKeys: [],
  included: allContacts,
  addressKey: 'address',
  mobilePhoneKey: 'phone',
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
  disableMockContactInfo: false,
  depends: newContactPagesActive,
});
