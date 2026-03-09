import { profileContactInfoPages } from 'platform/forms-system/src/js/patterns/prefill';
import { standardEmailSchema } from 'platform/forms-system/src/js/utilities/data/profile';
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
  // Use string email schema to avoid data collision with old contact info pages
  // during createInitialState deep merge. The ContactInfo component's syncProfileData
  // will set the correct object format at runtime.
  emailSchema: standardEmailSchema,
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
