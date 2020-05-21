import React from 'react';

import GenderAndDOBSection from './GenderAndDOBSection';
import ContactInformationSection from './ContactInformationSection';
import EmailInformationSection from './EmailInformationSection';

const ContactInformationContent = () => (
  <>
    <GenderAndDOBSection className="vads-u-margin-bottom--6" />

    <ContactInformationSection className="vads-u-margin-bottom--6" />

    <EmailInformationSection />
  </>
);

export default ContactInformationContent;
