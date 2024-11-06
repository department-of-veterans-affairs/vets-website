import React from 'react';

export default function LicenseCertificationResultInfo(resultInfo) {
  const { institution, tests } = resultInfo.resultInfo;

  return (
    <>
      <div className="table-container">
        <va-table stacked={false} className="lc-table">
          <va-table-row slot="headers">
            <span className="table-header">Test</span>
            <span className="table-header"> Fee</span>
          </va-table-row>
          {tests.map((test, i) => {
            return (
              <va-table-row key={i}>
                <span>{test.name}</span>
                <span>
                  {test.fee.toLocaleString('en-US', {
                    currency: 'USD',
                    maximumFractionDigits: 0,
                    minimumFractionDigits: 0,
                    style: 'currency',
                  })}
                </span>
              </va-table-row>
            );
          })}
        </va-table>
      </div>
      <div className="provider-info-container">
        <span className="vads-u-display--flex">
          <va-icon
            icon="location_city"
            class="vads-u-display--flex vads-u-align-items--center icon"
          />
          <p>{institution.name}</p>
        </span>
        <span className="vads-u-display--flex">
          <va-icon
            icon="phone"
            class="vads-u-display--flex vads-u-align-items--center icon"
          />
          <p>{institution.phone}</p>
        </span>
      </div>
      <div className="address-container">
        <strong>Physical address and mailing address are the same</strong>
        <p className="va-address-block">
          {institution.physicalStreet}
          <br />
          {institution.physicalCity}, {` `}
          {institution.physicalState} {` `}
          {institution.physicalZip}
          <br />
          {institution.physicalCountry}
        </p>
      </div>
      <div className="form-link-wrapper">
        <p>
          <strong>
            Print and fill out form Request for Reimbursement of Licensing or
            Certification Test Fees
          </strong>
        </p>
        <a href="/" className="">
          Link to VA Form 22-0803
        </a>
      </div>
    </>
  );
}
