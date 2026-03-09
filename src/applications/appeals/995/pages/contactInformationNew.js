import { profileContactInfoPages } from 'platform/forms-system/src/js/patterns/prefill';
import {
  getContent,
  standardEmailSchema,
} from 'platform/forms-system/src/js/utilities/data/profile';
import set from 'platform/utilities/data/set';
import { newContactPagesActive } from '../../shared/utils';
import { contactInfo995Validation } from '../../shared/validations/contactInfo';

export const allContacts = ['mobilePhone', 'homePhone', 'address', 'email'];
export const noAddressContacts = ['mobilePhone', 'homePhone', 'email'];

export default profileContactInfoPages({
  content: getContent('appeal'),
  addressKey: 'address',
  // Override defaults because of addressKey change
  included: allContacts,
  contactInfoRequiredKeys: [],
  // Use string email schema to avoid data collision with old contact info pages
  // during createInitialState deep merge. The ContactInfo component's syncProfileData
  // will set the correct object format at runtime.
  emailSchema: standardEmailSchema,
  contactInfoUiSchema: {
    'ui:options': {
      updateSchema: (formData = {}, schema) =>
        set(
          'properties.veteran.required',
          formData?.housingRisk ? noAddressContacts : allContacts,
          schema,
        ),
    },
    'ui:required': () => true,
    'ui:validations': [contactInfo995Validation],
  },
  disableMockContactInfo: false,
  depends: newContactPagesActive,
});
