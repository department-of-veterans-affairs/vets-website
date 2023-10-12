import profileContactInfo, {
  profileReviewErrorOverride,
} from 'platform/forms-system/src/js/definitions/profileContactInfo';
import set from 'platform/utilities/data/set';
import { getContent } from 'platform/forms-system/src/js/utilities/data/profile.js';

import { contactInfoValidation } from '../../shared/validations/contactInfo';

// Fix review & submit page chapter & page error highlighting when there's an
// error; showing default settings
export const profileReviewOverride = profileReviewErrorOverride({
  contactInfoChapterKey: 'infoPages',
  contactInfoPageKey: 'confirmContactInfo',
  wrapperKey: 'veteran',
});

const allContacts = ['address', 'email', 'phone'];

export default profileContactInfo({
  content: getContent('appeal'),
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
});
