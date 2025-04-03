import contactInfoPage from 'platform/forms-system/src/js/components/ContactInfo/contactInfoPage';

import { getContent } from 'platform/forms-system/src/js/utilities/data/profile';

const content = {
  ...getContent('application'),
  description: null,
  title: 'Confirm the contact information we have on file for you',
};

export const contactInfo = contactInfoPage({
  content,
  contactInfoPageKey: 'confirmContactInfo3',
  contactPath: 'veteran-information',
  contactInfoRequiredKeys: ['mailingAddress'],
  included: ['homePhone', 'mailingAddress', 'email', 'mobilePhone'],
  disableMockContactInfo: true,
  prefillPatternEnabled: true,
});
