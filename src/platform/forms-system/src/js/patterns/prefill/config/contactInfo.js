import profileContactInfo from '../ContactInfo/profileContactInfo';
import { getContent } from '../../../utilities/data/profile';

export const contactInfo = profileContactInfo({
  content: {
    ...getContent('application'),
    description: null,
    title: 'Confirm the contact information we have on file for you',
  },
  contactPath: 'veteran-information',
  contactInfoRequiredKeys: ['mailingAddress'],
  prefillPatternEnabled: true,
});
