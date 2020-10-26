import React, { memo } from 'react';

import GenderAndDOBSection from './GenderAndDOBSection';
import ContactInformationSection from './ContactInformationSection';
import EmailInformationSection from './EmailInformationSection';

const PersonalInformationContent = () => (
  <>
    <GenderAndDOBSection className="vads-u-margin-bottom--6" />

    <ContactInformationSection className="vads-u-margin-bottom--6" />

    <EmailInformationSection />
  </>
);

export default memo(PersonalInformationContent);
