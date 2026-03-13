import { profileContactInfoPages } from 'platform/forms-system/src/js/patterns/prefill';
import { getContent } from 'platform/forms-system/src/js/utilities/data/profile';
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
