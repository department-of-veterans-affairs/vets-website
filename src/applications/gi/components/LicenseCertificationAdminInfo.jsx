import React from 'react';

function LicenseCertificationAdminInfo({ institution }) {
  const { name, mailingAddress } = institution;
  return (
    <div>
      <h3 className="vads-u-margin-top--1p5">Admin Info</h3>
      <p>{name}</p>
      <p>The following is the headquarters address.</p>

      <p className="va-address-block">
        {mailingAddress.address1}
        <br />
        {mailingAddress.city}, {mailingAddress.state} {mailingAddress.zip}
        <br />
      </p>
      <p>
        Print and fill out form Request for Reimbursement of Licensing or
        Certification Test Fees. Send the completed application to the Regional
        Processing Office for your region listed in the form.
      </p>
    </div>
  );
}

export default LicenseCertificationAdminInfo;
