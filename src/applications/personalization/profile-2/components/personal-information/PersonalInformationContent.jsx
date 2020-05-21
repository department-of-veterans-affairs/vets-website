import React from 'react';

import GenderAndDOB from './GenderAndDOB';
import ContactInformationSection from './ContactInformationSection';
import EmailInformationSection from './EmailInformationSection';

const ContactInformationContent = () => (
  <>
    <GenderAndDOB className="vads-u-margin-bottom--6" />

    <ContactInformationSection className="vads-u-margin-bottom--6" />

    <EmailInformationSection />
  </>
);

export default ContactInformationContent;
