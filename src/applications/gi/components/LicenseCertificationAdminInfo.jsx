import React from 'react';

function LicenseCertificationAdminInfo({ institution }) {
  const {
    name,
    mailingStreet,
    mailingCity,
    mailingState,
    mailingZip,
  } = institution;
  return (
    <div className="address-wrapper">
      <strong>
        <p>The following is the headquarters address</p>
      </strong>{' '}
      <p className="va-address-block">
        {name} <br />
        <br />
        {mailingStreet}
        <br />
        {mailingCity}, {mailingState} {mailingZip}
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
