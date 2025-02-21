import React from 'react';
import { capitalizeFirstLetter } from '../utils/helpers';

function LicenseCertificationAdminInfo({ institution, type }) {
  const { name, mailingAddress } = institution;

  return (
    <div>
      <h3 className="vads-u-margin-top--1p5 vads-u-margin-bottom--2">
        Admin info
      </h3>
      <div className="name-wrapper vads-u-display--flex vads-u-align-items--center">
        <va-icon
          class="vads-u-padding-right--1"
          icon="location_city"
          size={3}
        />
        <p className="vads-u-margin-y--0">{capitalizeFirstLetter(name)}</p>
      </div>
      {type === 'Certification' ? (
        <p>
          Certification tests are available to be taken nationally, search for a
          testing site near you.
        </p>
      ) : (
        <>
          <p>The following is the headquarters address.</p>

          <p className="va-address-block">
            {capitalizeFirstLetter(mailingAddress.address1)}
            <br />
            {capitalizeFirstLetter(mailingAddress.city)}, {mailingAddress.state}{' '}
            {mailingAddress.zip}
            <br />
          </p>
        </>
      )}
      <p className="vads-u-padding-top--1p5 vads-u-margin-bottom--1 vads-l-col--12 medium-screen:vads-l-col--7">
        Print and fill out form Request for Reimbursement of Licensing or
        Certification Test Fees. Send the completed application to the Regional
        Processing Office for your region listed in the form.
      </p>
      <p>
        <va-link
          text="Get VA Form22-0803 to download"
          href="https://www.va.gov/find-forms/about-form-22-0803/"
        />
      </p>
    </div>
  );
}

export default LicenseCertificationAdminInfo;
