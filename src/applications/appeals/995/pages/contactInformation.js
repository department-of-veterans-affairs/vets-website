import profileContactInfo from 'platform/forms-system/src/js/definitions/profileContactInfo';
import { getContent } from 'platform/forms-system/src/js/utilities/data/profile.js';

import { contactInfo995Validation } from '../../shared/validations/contactInfo';

export default profileContactInfo({
  content: getContent('appeal'),
  addressKey: 'address',
  contactInfoUiSchema: {
    'ui:required': () => true,
    'ui:validations': [contactInfo995Validation],
  },
});
