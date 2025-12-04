import { profileContactInfoPage } from 'platform/forms-system/src/js/patterns/prefill';
import { getContent } from 'platform/forms-system/src/js/utilities/data/profile';

const contactInformation = {
  ...profileContactInfoPage({
    content: {
      ...getContent('application'),
      description: null,
      title: 'Confirm the contact information we have on file for you',
    },
    contactPath: 'veteran-information',
    contactInfoRequiredKeys: ['mailingAddress'],
    prefillPatternEnabled: true,
  }),
};

export default contactInformation;
