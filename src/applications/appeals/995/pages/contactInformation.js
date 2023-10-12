import profileContactInfo, {
  profileReviewErrorOverride,
} from 'platform/forms-system/src/js/definitions/profileContactInfo';
import { getContent } from 'platform/forms-system/src/js/utilities/data/profile.js';

import { contactInfo995Validation } from '../../shared/validations/contactInfo';

// Fix review & submit page chapter & page error highlighting when there's an
// error; showing default settings
export const profileReviewOverride = profileReviewErrorOverride({
  contactInfoChapterKey: 'infoPages',
  contactInfoPageKey: 'confirmContactInfo',
  wrapperKey: 'veteran',
});

const allContacts = ['mobilePhone', 'homePhone', 'address', 'email'];

export default profileContactInfo({
  content: getContent('appeal'),
  contactInfoRequiredKeys: allContacts,
  included: allContacts,
  addressKey: 'address',
  contactInfoUiSchema: {
    'ui:required': () => true,
    'ui:validations': [contactInfo995Validation],
  },
});
