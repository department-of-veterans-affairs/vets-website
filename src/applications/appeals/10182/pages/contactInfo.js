import profileContactInfo from '@department-of-veterans-affairs/platform-forms-system/profileContactInfo';
import { set } from '@department-of-veterans-affairs/platform-forms-system/exports';

const allContacts = ['address', 'email', 'phone'];

export default profileContactInfo({
  contactInfoRequiredKeys: [],
  included: allContacts,
  addressKey: 'address',
  mobilePhoneKey: 'phone',
  contactInfoUiSchema: {
    'ui:options': {
      updateSchema: (formData, schema) => {
        return set(
          'properties.veteran.required',
          formData.homeless ? ['phone', 'email'] : allContacts,
          schema,
        );
      },
    },
  },
});
