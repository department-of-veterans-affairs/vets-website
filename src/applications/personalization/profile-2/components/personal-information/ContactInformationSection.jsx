import React from 'react';

import AdditionalInfo from '@department-of-veterans-affairs/formation-react/AdditionalInfo';

import AddressesTable from './AddressesTable';
import PhoneNumbersTable from './PhoneNumbersTable';

const ContactInformationSection = ({ className }) => (
  <div className={className}>
    <AddressesTable className="vads-u-margin-bottom--6" />

    <PhoneNumbersTable className="vads-u-margin-bottom--3" />

    {/* more info component for contact info */}
    <AdditionalInfo triggerText="Which of my benefits will use this contact information?">
      We’ll use this information to contact you about certain benefits and
      services, including disability compensation, pension benefits, and claims
      and appeals. If you’re enrolled in VA health care, we’ll send your
      prescriptions to the mailing address listed. Your health care team may
      also use this contact information to communicate with you.
    </AdditionalInfo>
  </div>
);

export default ContactInformationSection;
