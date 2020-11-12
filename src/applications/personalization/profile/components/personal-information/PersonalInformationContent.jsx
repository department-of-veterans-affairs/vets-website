import React, { memo } from 'react';

import InitializeVAPServiceID from '@@vap-svc/containers/InitializeVAPServiceID';

import GenderAndDOBSection from './GenderAndDOBSection';
import ContactInformationSection from './ContactInformationSection';
import EmailInformationSection from './email-addresses/EmailInformationSection';

const PersonalInformationContent = () => (
  <>
    <GenderAndDOBSection className="vads-u-margin-bottom--6" />

    <InitializeVAPServiceID>
      <ContactInformationSection className="vads-u-margin-bottom--6" />
      <EmailInformationSection />
    </InitializeVAPServiceID>
  </>
);

export default memo(PersonalInformationContent);
