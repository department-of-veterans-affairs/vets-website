import React from 'react';
import PropTypes from 'prop-types';

import AdditionalInfo from '@department-of-veterans-affairs/component-library/AdditionalInfo';

import AddressesTable from './addresses/AddressesTable';
import PhoneNumbersTable from './phone-numbers/PhoneNumbersTable';

const ContactInformationSection = ({ className }) => (
  <div className={className}>
    <div className="vads-u-margin-bottom--2">
      <AdditionalInfo triggerText="Which benefits and services does VA use this contact information for?">
        <p className="vads-u-margin-y--1">
          We use this information to contact you about these VA benefits and
          services:
        </p>
        <ul>
          <li>Disability compensation</li>
          <li>Pension benefits</li>
          <li>Claims and appeals</li>
          <li>Veteran Readiness and Employment (VR&E)</li>
        </ul>
        <p>
          If you’re enrolled in VA health care, we also use this information to
          send you these:
        </p>
        <ul>
          <li>Appointment reminders</li>
          <li>Communications from your VA medical center</li>
          <li>Lab and test results</li>
          <li>
            Prescription medicines (we send your medicines to your mailing
            address)
          </li>
        </ul>
        <p>
          <a href="/resources/change-your-address-on-file-with-va/#change-your-address-by-contact">
            Find out how to change your contact information for other VA
            benefits{' '}
          </a>
        </p>
      </AdditionalInfo>
    </div>
    <AddressesTable className="vads-u-margin-bottom--6" />

    <PhoneNumbersTable className="vads-u-margin-bottom--3" />
  </div>
);

ContactInformationSection.propTypes = {
  className: PropTypes.string,
};

export default ContactInformationSection;
