import React, { useEffect, useState, useLayoutEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  VaIcon,
  VaLink,
  VaAlert,
} from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { fetchNationalExamDetails } from '../actions';

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

  // Remove this once the table width is updated in the component

  useLayoutEffect(
    // eslint-disable-next-line consistent-return
    () => {
      if (!error) {
        const observer = new MutationObserver(() => {
          const vaTableInner = document.querySelector(
            '.exams-table va-table-inner',
          );
          if (vaTableInner?.shadowRoot) {
            const { shadowRoot } = vaTableInner;
            const usaTable = shadowRoot.querySelector('.usa-table');
            if (usaTable) {
              usaTable.style.width = '100%';
            }
          }
        });

        const vaTable = document.querySelector('.exams-table va-table');
        if (vaTable) {
          observer.observe(vaTable, {
            attributes: true,
            childList: true,
            subtree: true,
          });
        }
        return () => observer.disconnect();
      }
    },
    [examDetails, error],
  );

  if (error) {
    return (
      <div className="row vads-u-padding--1p5 mobile-lg:vads-u-padding--0">
        <VaAlert
          style={{ marginTop: '8px', marginBottom: '32px' }}
          status="error"
          data-e2e-id="alert-box"
        >
          <h2 slot="headline">
            We can’t load the National exam details right now
          </h2>
          <p>
            We’re sorry. There’s a problem with our system. Try again later.
          </p>
        </VaAlert>
      </div>
    );
  }

  if (loadingDetails || !examDetails) {
    return (
      <div className="row vads-u-margin-bottom--8 vads-u-padding--1p5 mobile-lg:vads-u-padding--0">
        <va-loading-indicator
          label="Loading"
          message="Loading your National exam details..."
        />
      </div>
    );
  }

  const { name, tests, institution } = examDetails;

  return (
    <div className="exam-details-container row vads-u-margin-bottom--8 vads-u-padding--1p5 mobile-lg:vads-u-padding--0">
      <h1 className="vads-u-margin-bottom--3">{name}</h1>
      <h3 className="vads-u-margin-bottom--2 vads-u-margin-top--0">
        Admin Info
      </h3>
      <div className="provider-info-container vads-u-margin-top--0p5 vads-u-margin-bottom--3">
        <span className="vads-u-display--flex vads-u-align-items--center vads-u-margin-bottom--1">
          <VaIcon icon="location_city" size={3} />

          <span>{institution?.name}</span>
        </span>
        {/* <span className="vads-u-display--flex vads-u-align-items--center">
          <VaIcon icon="public" size={3} />
          <span>{institution?.web_address}</span>
        </span> */}
      </div>

      <div className="address-container vads-u-margin-bottom--3">
        The following is the headquarters address.
        <p className="va-address-block vads-u-margin-top--1">
          {institution?.physicalAddress?.address1}
          <br />
          {institution.physicalAddress?.city},
          {institution.physicalAddress?.state}
          {institution.physicalAddress?.zip}
          <br />
          {institution.physicalAddress?.country}
        </p>
      </div>

      <div>
        <p className="vads-u-margin-bottom--0p5">
          Print and fill out form Request for Reimbursement of National Exam
          Fee. Send the completed application to the Regional Processing Office
          for your region listed in the form.
        </p>
        <div className="vads-u-margin-bottom--4">
          <VaLink
            href="https://www.va.gov/find-forms/about-form-22-0810/"
            text="Get link to VA Form 22-0810 to download"
          />
        </div>
      </div>
      <div className="exams-table">
        <h3 className="vads-u-margin-y--0">Test Info</h3>
        <va-table table-type={isMobile ? 'bordered' : undefined}>
          <va-table-row slot="headers">
            <span className="table-header">Fee Description</span>
            <span className="table-header">Dates</span>
            <span className="table-header">Amount</span>
          </va-table-row>
          {tests?.map((test, i) => {
            if (test.name === 'Blank') {
              return null;
            }
            return (
              <va-table-row key={i}>
                <span>{test.name}</span>
                <span>
                  {test.beginDate} - {test.endDate}
                </span>
                <span>
                  {Number(test.fee).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                  })}
                </span>
              </va-table-row>
            );
          })}
        </va-table>
      </div>
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
    }),
  }),
  loadingDetails: PropTypes.bool,
  error: PropTypes.string,
};

export default NationalExamDetails;
