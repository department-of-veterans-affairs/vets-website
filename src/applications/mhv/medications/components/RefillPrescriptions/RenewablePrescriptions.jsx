import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { waitForRenderThenFocus } from '@department-of-veterans-affairs/platform-utilities/ui';
import { setPrescriptionDetails } from '../../actions/prescriptions';
import { DD_ACTIONS_PAGE_TYPE, medicationsUrls } from '../../util/constants';
import { dateFormat, fromToNumbs } from '../../util/helpers';

const RenewablePrescriptions = ({ renewablePrescriptionsList = [] }) => {
  // Hooks
  const dispatch = useDispatch();

  // Pagination
  const MAX_PAGE_LIST_LENGTH = 20;
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: Math.ceil(
      renewablePrescriptionsList.length / MAX_PAGE_LIST_LENGTH,
    ),
  });

  const onPageChange = page => {
    setPagination(prevState => ({
      ...prevState,
      currentPage: page,
    }));
    waitForRenderThenFocus(
      "p[data-testid='renew-page-list-count']",
      document,
      500,
    );
  };

  const startIdx = (pagination.currentPage - 1) * MAX_PAGE_LIST_LENGTH;
  const endIdx = pagination.currentPage * MAX_PAGE_LIST_LENGTH;
  const paginatedRenewablePrescriptions = renewablePrescriptionsList.slice(
    startIdx,
    endIdx,
  );

  const displayRange = fromToNumbs(
    pagination.currentPage,
    renewablePrescriptionsList?.length,
    renewablePrescriptionsList.length,
    MAX_PAGE_LIST_LENGTH,
  );

  // Functions
  const onRxLinkClick = rx => {
    dispatch(setPrescriptionDetails(rx));
  };

  return (
    <div>
      <h2 className="vads-u-margin-top--4" data-testid="renew-section-subtitle">
        If you can’t find the prescription you’re looking for
      </h2>
      <div className="vads-u-margin-y--3">
        <p className="vads-u-margin-y--0">You may need to renew it. </p>
        <p className="vads-u-margin-y--0">
          <va-link
            href={medicationsUrls.MEDICATIONS_ABOUT_ACCORDION_RENEW}
            text="Learn how to renew prescriptions"
            data-testid="learn-to-renew-prescriptions-link"
            data-dd-action-name={`Learn How To Renew Prescriptions Action Link - ${
              DD_ACTIONS_PAGE_TYPE.REFILL
            } - Renew Section`}
          />
        </p>
      </div>
      <div>
        <p className="vads-u-margin-y--0">
          <strong>Note:</strong> If your prescription isn’t listed here, find it
          in your medications list.{' '}
        </p>
        <p className="vads-u-margin-y--0">
          <Link
            data-testid="medications-page-link"
            to="/"
            data-dd-action-name={`Go To Your Medications List Action Link - ${
              DD_ACTIONS_PAGE_TYPE.REFILL
            } - Renew Section`}
          >
            Go to your medications list
          </Link>
        </p>
      </div>
      <h3 className="vads-u-margin-bottom--0" data-testid="renewable-rx">
        Prescriptions you may need to renew
      </h3>
      {renewablePrescriptionsList.length > 0 && (
        <>
          <p data-testid="renew-page-list-count">
            Showing
            <span>{` ${displayRange[0]} - ${displayRange[1]} of`}</span>
            {` ${renewablePrescriptionsList.length} prescriptions`}
          </p>
          <div className="no-print rx-page-total-info vads-u-border-bottom--2px vads-u-border-color--gray-lighter" />
        </>
      )}
      <div>
        {paginatedRenewablePrescriptions.map((prescription, idx) => (
          <div
            key={idx}
            className={`vads-u-margin-top--${idx !== 0 ? '5' : '2p5'}`}
          >
            <h4 className="vads-u-margin--0">
              <Link
                data-testid={`medication-details-page-link-${idx}`}
                to={`/prescription/${prescription.prescriptionId}`}
                onClick={() => onRxLinkClick(prescription)}
              >
                {prescription.prescriptionName}
              </Link>
            </h4>
            <p className="vads-u-margin-top--0">
              Prescription number: {prescription.prescriptionNumber}
              <br />
              <span data-testid={`renew-last-filled-${idx}`}>
                Last filled on{' '}
                {dateFormat(
                  prescription.rxRfRecords.find(record => record.dispensedDate)
                    ?.dispensedDate || prescription.dispensedDate,
                  'MMMM D, YYYY',
                )}
              </span>
              {prescription?.trackingList?.[0]?.completeDateTime && (
                <>
                  <br />
                  <span data-testid={`medications-last-shipped-${idx}`}>
                    {/* <va-icon
                      size={4}
                      icon="see Storybook for icon names: https://design.va.gov/storybook/?path=/docs/uswds-va-icon--default"
                      className="vads-u-margin-right--1p5"
                    /> */}
                    Last refill shipped on{' '}
                    {dateFormat(
                      prescription.trackingList[0].completeDateTime,
                      'MMMM D, YYYY',
                    )}
                  </span>
                </>
              )}
            </p>
          </div>
        ))}
        <div className="renew-pagination-container">
          {renewablePrescriptionsList.length > MAX_PAGE_LIST_LENGTH && (
            <VaPagination
              max-page-list-length={MAX_PAGE_LIST_LENGTH}
              id="pagination"
              className="vads-u-justify-content--center no-print"
              onPageSelect={e => onPageChange(e.detail.page)}
              page={pagination.currentPage}
              pages={pagination.totalPages}
              unbounded
              uswds
              data-testid="renew-pagination"
            />
          )}
        </div>
      </div>
    </div>
  );
};

RenewablePrescriptions.propTypes = {
  renewablePrescriptionsList: PropTypes.array,
};

export default RenewablePrescriptions;
