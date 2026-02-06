import React from 'react';
import PropTypes from 'prop-types';

import AddressesTable from './addresses/AddressesTable';

const ContactInformationSection = ({ className, showBadAddress }) => {
  return (
    <div className={className}>
      <div className="vads-u-margin-bottom--4">
        <va-additional-info
          trigger="Which benefits and services does VA use this contact information for?"
          uswds
        >
          <div>
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
              If you’re enrolled in VA health care, we also use this information
              to send you these:
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
              <va-link
                href="/resources/change-your-address-on-file-with-va/#change-your-address-by-contact"
                text="Find out how to change your contact information for other VA
                benefits"
              />
            </p>
            <p>
              This address is not used for Montgomery GI Bill benefits. Use the
              link below to update your address.
            </p>
            <p>
              <va-link
                href="/education/verify-school-enrollment/#for-montgomery-gi-bill-benefit"
                text="Update mailing address for Montgomery GI Bill benefits"
              />
            </p>
          </div>
        </va-additional-info>
      </div>
      <AddressesTable
        className="vads-u-margin-bottom--6"
        showBadAddress={showBadAddress}
      />
    </div>
  );
};

ContactInformationSection.propTypes = {
  className: PropTypes.string,
  showBadAddress: PropTypes.bool,
};

export default ContactInformationSection;
