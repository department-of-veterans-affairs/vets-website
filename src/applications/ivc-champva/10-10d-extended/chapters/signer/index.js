import contactInformation from './contactInformation';
import mailingAddress from './mailingAddress';
import name from './name';
import relationship from './relationship';
import role from './role';

const roleIsOther = formData => formData.certifierRole === 'other';

export const signerPages = {
  certifierRole: {
    path: 'who-is-applying',
    title: 'Your role',
    ...role,
  },
  certifierName: {
    path: 'your-name',
    title: 'Your name',
    ...name,
  },
  certifierMailingAddress: {
    path: 'your-mailing-address',
    title: 'Your mailing address',
    ...mailingAddress,
  },
  certifierContactInfo: {
    path: 'your-contact-information',
    title: 'Your contact information',
    ...contactInformation,
  },
  certifierRelationship: {
    path: 'your-relationship-to-applicant',
    title: 'Your relationship to applicant',
    depends: roleIsOther,
    ...relationship,
  },
};
