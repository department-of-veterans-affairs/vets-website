import profileContactInfo from 'platform/forms-system/src/js/definitions/profileContactInfo';
import { getContent } from 'platform/forms-system/src/js/utilities/data/profile';
import set from 'platform/utilities/data/set';
import { newContactPagesActive } from '../../shared/utils';
import { contactInfo995Validation } from '../../shared/validations/contactInfo';

export const allContacts = ['mobilePhone', 'homePhone', 'address', 'email'];
export const noAddressContacts = ['mobilePhone', 'homePhone', 'email'];

export default profileContactInfo({
  content: getContent('appeal'),
  addressKey: 'address',
  // Override defaults because of addressKey change
  included: allContacts,
  contactInfoRequiredKeys: [],
  contactInfoPageKey: 'confirmContactInfoV0',
  contactPath: 'contact-information-v0',
  // Explicit default ensures getDefaultFormState returns '' instead of undefined,
  // so lodash merge overwrites the new pages' email object default during
  // createInitialState (merge skips undefined values).
  emailSchema: { type: 'string', default: '' },
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
  depends: formData => !newContactPagesActive(formData),
});
