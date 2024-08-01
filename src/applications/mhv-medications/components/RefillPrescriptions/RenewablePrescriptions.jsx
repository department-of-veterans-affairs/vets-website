import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { VaPagination } from '@department-of-veterans-affairs/component-library/dist/react-bindings';
import { waitForRenderThenFocus } from '@department-of-veterans-affairs/platform-utilities/ui';
import { setPrescriptionDetails } from '../../actions/prescriptions';
import { medicationsUrls } from '../../util/constants';
import { dateFormat, fromToNumbs } from '../../util/helpers';
import { dataDogActionNames } from '../../util/dataDogConstants';

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
        <p
          className="vads-u-margin-y--0"
          data-testid="renew-section-description"
        >
          You may have already requested a refill for that prescription. To
          review your recent refill requests, go to your medications list and
          find medications with a status of <strong>Active: Submitted</strong>{' '}
          or <strong>Active: Refill in process.</strong>
        </p>
      </div>
      <div className="vads-u-margin-y--0">
        <Link
          data-testid="medications-page-link"
          to="/"
          data-dd-action-name={
            dataDogActionNames.refillPage
              .GO_TO_YOUR_MEDICATIONS_LIST_ACTION_LINK_RENEW
          }
        >
          Go to your medications list
        </Link>
        <p>Or you may need to renew your prescription to get more refills.</p>
        <Link
          class="vads-u-margin-y--0"
          to={medicationsUrls.MEDICATIONS_ABOUT_ACCORDION_RENEW.replace(
            medicationsUrls.MEDICATIONS_URL,
            '',
          )}
          data-testid="learn-to-renew-prescriptions-link"
          data-dd-action-name={
            dataDogActionNames.refillPage
              .LEARN_TO_RENEW_PRESCRIPTIONS_ACTION_LINK
          }
        >
          Learn how to renew prescriptions
        </Link>
      </div>

      {renewablePrescriptionsList.length > 0 && (
        <>
          <h3 className="vads-u-margin-bottom--0" data-testid="renewable-rx">
            Prescriptions you may need to renew
          </h3>
          <p data-testid="renew-page-list-count">
            Showing
            <span>{` ${displayRange[0]} - ${displayRange[1]} of`}</span>
            {` ${renewablePrescriptionsList.length} prescriptions`}
          </p>
          <div className="no-print rx-page-total-info vads-u-border-bottom--2px vads-u-border-color--gray-lighter" />
        </>
      )}
      <div>
        {paginatedRenewablePrescriptions.map((prescription, idx) => {
          const lastFilledDate =
            prescription.rxRfRecords.find(record => record.dispensedDate)
              ?.dispensedDate || prescription.dispensedDate;
          const lastFilledContent = lastFilledDate
            ? `Last filled on ${dateFormat(lastFilledDate, 'MMMM D, YYYY')}`
            : `Not filled yet`;
          return (
            <div
              key={idx}
              className={`vads-u-margin-top--${idx !== 0 ? '5' : '2p5'}`}
            >
              <Link
                data-testid={`medication-details-page-link-${idx}`}
                to={`/prescription/${prescription.prescriptionId}`}
                onClick={() => onRxLinkClick(prescription)}
                className="vads-u-font-weight--bold"
              >
                {prescription.prescriptionName}
              </Link>
              <div className="renew-card-details">
                <p>
                  {`Prescription number: ${prescription.prescriptionNumber}`}
                </p>
                <p data-testid={`renew-last-filled-${idx}`}>
                  {lastFilledContent}
                </p>
                {prescription?.trackingList?.[0]?.completeDateTime && (
                  <p data-testid={`medications-last-shipped-${idx}`}>
                    <va-icon
                      icon="local_shipping"
                      size={3}
                      aria-hidden="true"
                    />
                    <span
                      className="vads-u-margin-left--1p5"
                      data-testid="shipped-date"
                    >
                      {`Last refill shipped on ${dateFormat(
                        prescription.trackingList[0].completeDateTime,
                        'MMMM D, YYYY',
                      )}`}
                    </span>
                  </p>
                )}
              </div>
            </div>
          );
        })}
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
