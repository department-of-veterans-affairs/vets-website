import React from 'react';

function LicenseCertificationAdminInfo({ institution }) {
  const { name, mailingAddress } = institution;
  return (
    <div className="address-wrapper">
      <h3>Admin Info</h3>
      <p className="va-address-block">
        {name} <br />
        <br />
        {mailingAddress.address1}
        <br />
        {mailingAddress.city}, {mailingAddress.state} {mailingAddress.zip}
        <br />
      </p>
      <strong>
        <p>
          Fill out the form Request for Reimbursement of Licensing or
          Certification Test Fees.
        </p>
      </strong>{' '}
    </div>
  );
}

export default LicenseCertificationAdminInfo;
