import React, { memo } from 'react';

import Vet360InitializeID from '@@vap-svc/containers/InitializeVet360ID';

import GenderAndDOBSection from './GenderAndDOBSection';
import ContactInformationSection from './ContactInformationSection';
import EmailInformationSection from './email-addresses/EmailInformationSection';

const PersonalInformationContent = () => (
  <>
    <GenderAndDOBSection className="vads-u-margin-bottom--6" />

    <Vet360InitializeID>
      <ContactInformationSection className="vads-u-margin-bottom--6" />
      <EmailInformationSection />
    </Vet360InitializeID>
  </>
);

export default memo(PersonalInformationContent);
