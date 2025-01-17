import {
  VaIcon,
  VaLink,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import React from 'react';

function LicenseCertificationAdminInfo({ institution }) {
  const { name, mailingAddress } = institution;
  return (
    <div>
      <h3 className="vads-u-margin-top--1p5">Admin Info</h3>
      <div className="name-wrapper vads-u-display--flex vads-u-align-items--center">
        <VaIcon
          className="vads-u-padding-right--1"
          icon="location_city"
          size={3}
        />
        <p>{name}</p>
      </div>
      <p>The following is the headquarters address.</p>

      <p className="va-address-block">
        {mailingAddress.address1}
        <br />
        {mailingAddress.city}, {mailingAddress.state} {mailingAddress.zip}
        <br />
      </p>
      <p className="vads-u-padding-top--1p5 vads-u-margin-bottom--1">
        Print and fill out form Request for Reimbursement of Licensing or
        Certification Test Fees. Send the completed application to the Regional
        Processing Office for your region listed in the form.
      </p>
      <VaLink
        text="Get VA Form22-0803 to download"
        href="../../../find-forms/about-form-22-0803/"
      />
    </div>
  );
}

export default LicenseCertificationAdminInfo;
