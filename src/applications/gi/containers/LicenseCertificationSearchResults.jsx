import React from 'react';

const results = [
  {
    title: 'Certification in Forensic Odontology',
    type: 'Certification',
    tests: [
      { testName: 'Part 1', fee: 220 },
      { testName: 'Part 2', fee: 220 },
      { testName: 'Oral Exam', fee: 1000 },
    ],
    boardInfo: {
      name: 'AMERICAN BOARD OF FORENSIC ODONTOLOGY',
      phone: '205-902-2478',
      address: {
        street: '410 North 21st Street',
        city: 'Colorado Springs',
        state: 'CO',
        zip: '80904',
        country: 'United States of America',
      },
    },
    formInfo: {
      formNumber: '22-0803',
      description:
        'Print and fill out to request reimbursement for licenses and certifications.',
    },
  },
  {
    title: 'License in Forensic Dentistry',
    type: 'License',
    tests: [
      { testName: 'Part I', fee: 300 },
      { testName: 'Part II', fee: 150 },
      { testName: 'Oral Exam', fee: 1500 },
    ],
    boardInfo: {
      name: 'AMERICAN BOARD OF FORENSIC ODONTOLOGY',
      phone: '205-902-2478',
      address: {
        street: '410 North 21st Street',
        city: 'Colorado Springs',
        state: 'CO',
        zip: '80904',
        country: 'United States of America',
      },
    },
    formInfo: {
      formNumber: '22-0803',
      description:
        'Print and fill out to request reimbursement for licenses and certifications.',
    },
  },
];

function LicenseCertificationSearchResults() {
  return (
    <div>
      <section className="vads-u-display--flex vads-u-flex-direction--column vads-u-padding-x--2p5 mobile-lg:vads-u-padding-x--2">
        <div className="row">
          <h1 className="vads-u-text-align--center mobile-lg:vads-u-text-align--left">
            Licenses and Certifications Search Results
          </h1>
          <p className="vads-u-color--gray-dark lc-filter-options">
            Showing 2 of 2 results for:
          </p>
          <p className="lc-filter-options">
            <strong>License/Certification Name: </strong>
            "forensic"
          </p>
          <p className=" lc-filter-options">
            <strong>Country:</strong>
            "USA"
          </p>
        </div>
        <div className="row">
          <va-accordion>
            {results.map((result, index) => {
              return (
                <va-accordion-item
                  key={index}
                  id={index}
                  header={result.title}
                  subheader={result.type}
                >
                  <div className="table-container">
                    <va-table stacked={false} className="lc-table">
                      <va-table-row slot="headers">
                        <span className="table-header">Test</span>
                        <span className="table-header"> Fee</span>
                      </va-table-row>
                      {result.tests.map((test, i) => {
                        return (
                          <va-table-row key={i}>
                            <span>{test.testName}</span>
                            <span>{test.fee}</span>
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
                      <p>{result.boardInfo.name}</p>
                    </span>
                    <span className="vads-u-display--flex">
                      <va-icon
                        icon="phone"
                        class="vads-u-display--flex vads-u-align-items--center icon"
                      />
                      <p>{result.boardInfo.phone}</p>
                    </span>
                  </div>
                  <div className="address-container">
                    <strong>
                      Physical address and mailing address are the same
                    </strong>
                    <p className="va-address-block">
                      {result.boardInfo.address.street}
                      <br />
                      {result.boardInfo.address.city}, {` `}
                      {result.boardInfo.address.state} {` `}
                      {result.boardInfo.address.zip}
                      <br />
                      {result.boardInfo.address.country}
                    </p>
                  </div>
                  <div className="form-link-wrapper">
                    <p>
                      <strong>
                        Print and fill out form Request for Reimbursement of
                        Licensing or Certification Test Fees
                      </strong>
                    </p>
                    <a href="/" className="">
                      Link to VA Form 22-0803
                    </a>
                  </div>
                </va-accordion-item>
              );
            })}
          </va-accordion>
        </div>
      </section>
    </div>
  );
}

export default LicenseCertificationSearchResults;
