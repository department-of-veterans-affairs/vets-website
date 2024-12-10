import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { fetchNationalExams } from '../actions';

const NationalExamsList = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const { loading, error, nationalExams } = useSelector(
    state => state.nationalExams,
  );
  useEffect(
    () => {
      dispatch(fetchNationalExams('exam'));
    },
    [dispatch],
  );

  // Remove this once the table width is updated in the component
  useEffect(
    // eslint-disable-next-line consistent-return
    () => {
      if (nationalExams.length > 0) {
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

        // Observe specifically the va-table element for attribute changes (like pagination changes)
        const vaTable = document.querySelector('.exams-table');
        if (vaTable) {
          observer.observe(vaTable, {
            attributes: true,
            childList: true,
            subtree: true,
          });
        }

        // Cleanup observer when component is unmounted or dependencies change
        return () => observer.disconnect();
      }
    },
    [currentPage, nationalExams],
  );

  // Calculate total pages and slice programs for pagination
  const totalPages = Math.ceil(nationalExams.length / itemsPerPage);
  const currentExams = nationalExams.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handlePageChange = page => {
    setCurrentPage(page);
  };

  const NationalExamsInfo = () => (
    <>
      <h1 className="vads-u-margin-bottom--3">National Exams</h1>
      <p className="national-exams-description vads-u-margin-bottom--3">
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
        style={{ marginBottom: '24px', display: 'inline-block' }}
        href="https://www.va.gov/education/about-gi-bill-benefits/how-to-use-benefits/national-tests/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Find out how to get reimbursed for national tests
      </a>
    </>
  );

  if (error) {
    return (
      <div className="national-exams-container row vads-u-padding--1p5 mobile-lg:vads-u-padding--0">
        <NationalExamsInfo />
        <va-alert
          style={{ marginTop: '8px', marginBottom: '32px' }}
          status="error"
          data-e2e-id="alert-box"
        >
          <h2 slot="headline">
            We can’t load the National Exams list right now
          </h2>
          <p>
            We’re sorry. There’s a problem with our system. Try again later.
          </p>
        </va-alert>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="national-exams-container row vads-u-margin-bottom--8 vads-u-padding--1p5 mobile-lg:vads-u-padding--0">
        <NationalExamsInfo />
        <va-loading-indicator
          label="Loading"
          message="Loading your National Exams..."
        />
      </div>
    );
  }

  return (
    <div className="national-exams-container row vads-u-padding--1p5 mobile-lg:vads-u-padding--0">
      <NationalExamsInfo />
      <va-accordion open-single>
        {currentExams.map(exam => (
          <va-accordion-item header={exam.name} key={exam.name} id={exam.name}>
            <div className="exams-table">
              <va-table table-type="bordered" className="exams-table">
                <va-table-row slot="headers">
                  <span className="table-header">Fee Description</span>
                  <span className="table-header">Dates</span>
                  <span className="table-header">Amount</span>
                </va-table-row>
                {exam.tests.map((test, i) => (
                  <va-table-row key={i}>
                    <span>{test.description}</span>
                    <span>{test.dates}</span>
                    <span>
                      {test.amount.toLocaleString('en-US', {
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
                  <span>{exam.institution.name}</span>
                </span>
                <span className="vads-u-display--flex vads-u-align-items--center">
                  <va-icon icon="public" size={3} />
                  <span>{exam.institution.webAddress}</span>
                </span>
              </div>
              <div className="address-container vads-u-margin-bottom--3">
                <strong>The following is the headquarters address.</strong>
                <p className="va-address-block vads-u-margin-top--1">
                  {exam.institution.physicalStreet}
                  <br />
                  {exam.institution.physicalCity},
                  {exam.institution.physicalState}
                  {exam.institution.physicalZip}
                  <br />
                  {exam.institution.physicalCountry}
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
