import React, { useState, useEffect } from 'react';

import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';

const NationalExamsList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const exams = [
    { id: 1, name: 'SAT', date: '2024-12-01' },
    { id: 2, name: 'ACT', date: '2024-12-15' },
    { id: 3, name: 'GRE', date: '2025-01-10' },
    { id: 4, name: 'SAT', date: '2024-12-01' },
    { id: 5, name: 'ACT', date: '2024-12-15' },
    { id: 6, name: 'GRE', date: '2025-01-10' },
    { id: 7, name: 'SAT', date: '2024-12-01' },
    { id: 8, name: 'ACT', date: '2024-12-15' },
    { id: 9, name: 'GRE', date: '2025-01-10' },
    { id: 10, name: 'SAT', date: '2024-12-01' },
    { id: 11, name: 'ACT', date: '2024-12-15' },
    { id: 12, name: 'GRE', date: '2025-01-10' },
  ];
  const mockResultInfo = {
    institution: {
      name: 'National Certification Center',
      phone: '123-456-7890',
      link: 'https://example.com',
      physicalStreet: '123 Main St',
      physicalCity: 'Springfield',
      physicalState: 'IL',
      physicalZip: '62704',
      physicalCountry: 'USA',
    },
    tests: [
      {
        name: 'Certified Professional Coder (CPC)',
        date: '2025-01-10 - 2025-01-15',
        fee: 300,
      },
      {
        name: 'Project Management Professional (PMP)',
        date: '2025-01-10 - 2025-01-15',
        fee: 550,
      },
      {
        name: 'Certified Information Systems Security Professional (CISSP)',
        date: '2025-01-10 - 2025-01-15',
        fee: 700,
      },
    ],
  };

  // Remove this once the table width is updated in the component
  useEffect(
    () => {
      const observer = new MutationObserver(() => {
        // Select all va-table-inner elements
        const vaTableInners = document.querySelectorAll(
          '.exams-table va-table-inner',
        );

        vaTableInners.forEach(vaTableInner => {
          if (vaTableInner?.shadowRoot) {
            // Access the shadow root of va-table-inner
            const { shadowRoot } = vaTableInner;

            // Query for the usa-table inside the shadow root
            const usaTable = shadowRoot.querySelector('.usa-table');

            if (usaTable) {
              usaTable.style.width = '100%';
            }
          }
        });
      });

      //  Observe specifically the va-table element for attribute changes (like pagination changes)
      const vaTable = document.querySelector('.exams-table');
      observer.observe(vaTable, {
        attributes: true,
        childList: true,
        subtree: true,
      });

      // Cleanup observer when component is unmounted or dependencies change
      return () => observer.disconnect();
    },
    [currentPage],
  ); // Re-run when the page changes

  // Calculate total pages and slice programs for pagination
  const totalPages = Math.ceil(exams.length / itemsPerPage);
  const currentExams = exams.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handlePageChange = page => {
    setCurrentPage(page);
  };

  return (
    <div className="national-exams-container row vads-u-padding--1p5 mobile-lg:vads-u-padding--0">
      <h1 className="vads-u-margin-bottom--3">National Exams</h1>
      <p className="national-exams-description vads-u-margin-bottom--3 ">
        Part of your entitlement can be used to cover the costs of national
        exams (admissions tests required for college or graduate school)—even if
        you’re already receiving other education benefits. We’ll pay you back
        for the cost to register and any administrative fees. We’ll prorate the
        entitlement charges based on the actual amount of the fee charged for
        the test.
      </p>
      <p className="national-exams-description vads-u-margin-bottom--3">
        Exams are available to be taken nationally, search for a testing site
        near you.
      </p>

      <a
        style={{ marginBottom: '16px', display: 'inline-block' }}
        href="https://www.va.gov/education/about-gi-bill-benefits/how-to-use-benefits/national-tests/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Find out how to get reimbursed for national tests
      </a>

      <va-accordion open-single>
        {currentExams.map(exam => (
          <va-accordion-item header={exam.name} key={exam.id} id={exam.id}>
            <div className="exams-table">
              <va-table table-type="bordered" className="exams-table">
                <va-table-row slot="headers">
                  <span className="table-header">Fee Description</span>
                  <span className="table-header">Dates</span>
                  <span className="table-header">Amount</span>
                </va-table-row>
                {mockResultInfo.tests.map((test, i) => (
                  <va-table-row key={i}>
                    <span>{test.name}</span>
                    <span>{test.date}</span>
                    <span>
                      {test.fee.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 0,
                      })}
                    </span>
                  </va-table-row>
                ))}
              </va-table>

              <div className="provider-info-container vads-u-margin-top--0p5 vads-u-margin-bottom--3">
                <span className="vads-u-display--flex vads-u-align-items--center vads-u-margin-bottom--1">
                  <va-icon icon="location_city" size={3} />
                  <span>{mockResultInfo.institution.name}</span>
                </span>
                <span className="vads-u-display--flex vads-u-align-items--center">
                  <va-icon icon="public" size={3} />
                  <span>{mockResultInfo.institution.link}</span>
                </span>
              </div>
              <div className="address-container vads-u-margin-bottom--3">
                <strong>The following is the headquarters address.</strong>
                <p className="va-address-block vads-u-margin-top--1">
                  {mockResultInfo.institution.physicalStreet}
                  <br />
                  {mockResultInfo.institution.physicalCity},
                  {mockResultInfo.institution.physicalState}
                  {mockResultInfo.institution.physicalZip}
                  <br />
                  {mockResultInfo.institution.physicalCountry}
                </p>
              </div>
              <div>
                <p className="vads-u-margin-bottom--0p5">
                  <strong>
                    Print and fill out form Request for Reimbursement of
                    National Exam Fee. Send the completed application to the
                    Regional Processing Office for your region listed in the
                    form.
                  </strong>
                </p>
                <div className="vads-u-margin-bottom--3">
                  <a
                    href="https://www.va.gov/find-forms/about-form-22-0810/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get link to VA Form 22-0810 to print
                  </a>
                </div>
              </div>
            </div>
          </va-accordion-item>
        ))}
      </va-accordion>
      <VaPagination
        page={currentPage}
        pages={totalPages}
        maxPageListLength={5}
        data-testid="currentPage"
        onPageSelect={e => handlePageChange(e.detail.page)}
        className="vads-u-border-top--0 vads-u-margin-top--1 vads-u-padding-bottom--9"
      />
    </div>
  );
};

export default NationalExamsList;
