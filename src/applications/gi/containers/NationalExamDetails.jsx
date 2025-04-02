import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { fetchNationalExamDetails } from '../actions';
import {
  formatNationalExamName,
  formatAddress,
  toTitleCase,
} from '../utils/helpers';

const NationalExamDetails = () => {
  const dispatch = useDispatch();
  const { examId } = useParams();
  const [isMobile, setIsMobile] = useState(false);
  const { examDetails, loadingDetails, error } = useSelector(
    state => state.nationalExams,
  );
  useEffect(
    () => {
      window.scrollTo(0, 0);
      dispatch(fetchNationalExamDetails(examId));
    },
    [examId, dispatch],
  );

  useEffect(() => {
    function handleResize() {
      const isNowMobile = window.innerWidth < 481;
      setIsMobile(isNowMobile);

      const vaTableInner = document.querySelector(
        '.exams-table va-table-inner',
      );
      if (vaTableInner?.shadowRoot) {
        const { shadowRoot } = vaTableInner;
        const usaTable = shadowRoot.querySelector('.usa-table');
        if (usaTable) {
          if (isNowMobile) {
            usaTable.classList.add('usa-table--bordered');
            usaTable.classList.remove('usa-table--borderless');
          } else {
            usaTable.classList.remove('usa-table--bordered');
            usaTable.classList.add('usa-table--borderless');
          }
        }
      }
    }
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (error) {
    return (
      <div className="row vads-u-padding--1p5 mobile-lg:vads-u-padding--0">
        <va-alert
          style={{ marginTop: '8px', marginBottom: '32px' }}
          status="error"
          data-e2e-id="alert-box"
        >
          <h2 slot="headline">
            We can’t load the national exam details right now
          </h2>
          <p>
            We’re sorry. There’s a problem with our system. Try again later.
          </p>
        </va-alert>
      </div>
    );
  }

  if (loadingDetails || !examDetails) {
    return (
      <div className="row vads-u-margin-bottom--8 vads-u-padding--1p5 mobile-lg:vads-u-padding--0">
        <va-loading-indicator
          label="Loading"
          message="Loading your national exam details..."
        />
      </div>
    );
  }

  const { name, tests, institution } = examDetails;
  const validTests = tests?.filter(test => test.name !== 'Blank') || [];
  const totalTests = validTests.length;
  const renderTestInfo = () => {
    if (totalTests === 1) {
      const test = validTests[0];
      return (
        <div className="exam-single-test usa-width-two-thirds">
          <h2 className="vads-u-font-size--h3 vads-u-margin-y--0">Test Info</h2>
          <p className="vads-u-margin-bottom--0">Showing 1 of 1 test</p>
          {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
          <ul className="remove-bullets" role="list">
            <li data-testid="fee-description">
              <strong>Fee description: </strong>
              {test.name}
            </li>
            <li data-testid="maximum-reimbursement">
              <strong>Maximum reimbursement:</strong>{' '}
              {Number(test.fee).toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
              })}
            </li>
          </ul>
          <p>
            <strong>
              The amount reimbursed may differ from the actual cost of the exam.
            </strong>
          </p>
        </div>
      );
    }
    if (totalTests > 1) {
      return (
        <div className="exams-table">
          <h2 className="vads-u-font-size--h3 vads-u-margin-y--0">Test Info</h2>
          <p className="vads-u-margin-bottom--0">
            Showing 1 - {totalTests} of {totalTests} tests
          </p>
          <va-table full-width table-type={isMobile ? 'bordered' : undefined}>
            <va-table-row slot="headers">
              <span className="table-header">Fee description</span>
              <span className="table-header" style={{ whiteSpace: 'nowrap' }}>
                Maximum reimbursement
              </span>
            </va-table-row>
            {validTests.map((test, i) => (
              <va-table-row key={i}>
                <span>{test.name}</span>
                <span>
                  {Number(test.fee).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                  })}
                </span>
              </va-table-row>
            ))}
          </va-table>
          <p>
            <strong>
              The amount reimbursed may differ from the actual cost of the exam.
            </strong>
          </p>
        </div>
      );
    }
    return <p>No tests available</p>;
  };

  return (
    <div className="exam-details-container row vads-u-margin-bottom--8 vads-u-padding--1p5 mobile-lg:vads-u-padding--0">
      <div className="usa-width-two-thirds">
        <h1 className="vads-u-margin-bottom--3">
          {formatNationalExamName(name)}
        </h1>
        <h2 className="vads-u-font-size--h3 vads-u-margin-bottom--2 vads-u-margin-top--0">
          Admin Info
        </h2>
        <div className="provider-info-container vads-u-margin-top--0p5 vads-u-margin-bottom--3">
          <span className="vads-u-display--flex vads-u-align-items--center vads-u-margin-bottom--1">
            <va-icon icon="location_city" size={3} />
            <span>{toTitleCase(institution?.name)}</span>
          </span>
          <span className="vads-u-display--flex vads-u-align-items--center">
            <va-icon icon="public" size={3} />
            <span>{institution?.webAddress ?? 'Not available'}</span>
          </span>
        </div>

        <div className="address-container vads-u-margin-bottom--3">
          The following is the headquarters address.
          <p className="va-address-block vads-u-margin-top--1">
            {formatAddress(institution?.physicalAddress?.address1)}
            <br />
            {formatAddress(institution.physicalAddress?.city)},{' '}
            {institution.physicalAddress?.state}{' '}
            {institution.physicalAddress?.zip}
          </p>
        </div>
        <div>
          <p className="vads-u-margin-bottom--0p5">
            Print and fill out form Request for Reimbursement of National Exam
            Fee after you’ve taken the test. Send the completed application to
            the Regional Processing Office for your region listed in the form.
          </p>
          <div className="vads-u-margin-bottom--4">
            <va-link
              href="https://www.va.gov/find-forms/about-form-22-0810/"
              text="Get link to VA Form 22-0810 to download"
            />
          </div>
        </div>
      </div>
      {renderTestInfo()}
    </div>
  );
};

NationalExamDetails.propTypes = {
  examDetails: PropTypes.shape({
    name: PropTypes.string,
    tests: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        beginDate: PropTypes.string,
        endDate: PropTypes.string,
        fee: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      }),
    ),
    institution: PropTypes.shape({
      name: PropTypes.string,
      physicalAddress: PropTypes.shape({
        address1: PropTypes.string,
        city: PropTypes.string,
        state: PropTypes.string,
        zip: PropTypes.string,
        country: PropTypes.string,
      }),
      webAddress: PropTypes.string,
    }),
  }),
  loadingDetails: PropTypes.bool,
  error: PropTypes.string,
};

export default NationalExamDetails;
