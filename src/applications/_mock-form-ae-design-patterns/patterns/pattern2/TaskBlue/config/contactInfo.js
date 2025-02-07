import profileContactInfo from 'applications/_mock-form-ae-design-patterns/shared/components/ContactInfo/profileContactInfo';

import { getContent } from 'platform/forms-system/src/js/utilities/data/profile';

const content = {
  ...getContent('application'),
  description: null,
  title: 'Confirm the contact information we have on file for you',
};

export const contactInfo = profileContactInfo({
  content,
  contactInfoPageKey: 'confirmContactInfo3',
  contactPath: 'veteran-information',
  contactInfoRequiredKeys: [
    'mailingAddress',
    'email',
    'homePhone',
    'mobilePhone',
  ],
  included: ['homePhone', 'mailingAddress', 'email', 'mobilePhone'],
  disableMockContactInfo: true,
  prefillPatternEnabled: true,
});
