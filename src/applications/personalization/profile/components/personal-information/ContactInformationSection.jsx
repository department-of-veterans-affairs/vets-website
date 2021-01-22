import React from 'react';
import PropTypes from 'prop-types';

import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';

import AddressesTable from './addresses/AddressesTable';
import PhoneNumbersTable from './phone-numbers/PhoneNumbersTable';

const ContactInformationSection = ({ className }) => (
  <div className={className}>
    <AddressesTable className="vads-u-margin-bottom--6" />

    <PhoneNumbersTable className="vads-u-margin-bottom--3" />

    {/* more info component for contact info */}
    <AdditionalInfo triggerText="How will you use my contact information?">
      We’ll use this information to contact you about certain benefits and
      services, like disability compensation, pension benefits, and claims and
      appeals. If you’re enrolled in VA health care, we’ll send your
      prescriptions to your mailing address. Your health care team may also use
      this information to contact you.
    </AdditionalInfo>
  </div>
);

ContactInformationSection.propTypes = {
  className: PropTypes.string,
};

export default ContactInformationSection;
