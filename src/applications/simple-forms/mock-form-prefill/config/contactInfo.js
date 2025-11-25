// import profileContactInfo from 'platform/forms-system/src/js/definitions/profileContactInfo';
// eslint-disable-next-line @department-of-veterans-affairs/no-cross-app-imports
import profileContactInfo from 'applications/_mock-form-ae-design-patterns/shared/components/ContactInfo/profileContactInfo';
// import profileContactInfo from 'platform/forms-system/src/js/definitions/profileContactInfo';
import { getContent } from 'platform/forms-system/src/js/utilities/data/profile';

const content = {
  ...getContent('application'),
  description: null,
  title: 'Confirm the contact information we have on file for you',
};

export const contactInfo = profileContactInfo({
  content,
  contactInfoPageKey: 'confirmContactInfo',
  // contactPath: 'contact-information',
  contactPath: 'veteran-information',
  contactInfoRequiredKeys: ['mailingAddress'],
  included: ['homePhone', 'mailingAddress', 'email', 'mobilePhone'],
  disableMockContactInfo: true,
  prefillPatternEnabled: true,
});
