import React from 'react';

const results = [
  {
    title: 'Certification in Forensic Odontology',
    type: 'Certification',
    tests: [
      { testName: 'Part 1', fee: 220.0 },
      { testName: 'Part 2', fee: 220.0 },
      { testName: 'Oral Exam', fee: 1000.0 },
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
      { testName: 'Part 1', fee: 220.0 },
      { testName: 'Part 2', fee: 220.0 },
      { testName: 'Oral Exam', fee: 1000.0 },
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
            Showing 10 of 15 results for:
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
                  <p>{result.type}</p>
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
