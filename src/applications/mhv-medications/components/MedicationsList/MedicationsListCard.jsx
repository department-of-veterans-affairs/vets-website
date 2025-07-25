import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom-v5-compat';
import FillRefillButton from '../shared/FillRefillButton';
import ExtraDetails from '../shared/ExtraDetails';
import LastFilledInfo from '../shared/LastFilledInfo';
import { dateFormat } from '../../util/helpers';
import { dataDogActionNames } from '../../util/dataDogConstants';

const MedicationsListCard = ({ rx }) => {
  const pendingMed =
    rx.prescriptionSource === 'PD' && rx?.dispStatus === 'NewOrder';
  const pendingRenewal =
    rx.prescriptionSource === 'PD' && rx?.dispStatus === 'Renew';
  const latestTrackingStatus = rx?.trackingList?.[0];

  const cardBodyContent = () => {
    if (pendingRenewal || pendingMed) {
      return (
        <>
          <div className="vads-u-display--flex vads-u-margin-top--2">
            <span className="vads-u-flex--auto vads-u-padding-top--1">
              <va-icon icon="info" size={3} aria-hidden="true" />
            </span>
            <p
              className="vads-u-margin-left--2 vads-u-flex--1"
              data-testid="pending-renewal-rx"
              id={`pending-med-content-${rx.prescriptionId}`}
            >
              {pendingRenewal ? (
                <>
                  This is a renewal you requested. Your VA pharmacy is reviewing
                  it now. Details may change.
                </>
              ) : (
                <>
                  This is a new prescription from your provider. Your VA
                  pharmacy is reviewing it now. Details may change.
                </>
              )}
            </p>
          </div>
        </>
      );
    }
    return (
      <>
        {rx && <LastFilledInfo {...rx} />}
        {latestTrackingStatus && (
          <p
            className="vads-u-margin-top--1p5 vads-u-padding-bottom--1p5 vads-u-border-bottom--1px vads-u-border-color--gray-lighter"
            data-testid="rx-card-details--shipped-on"
            data-dd-privacy="mask"
          >
            <va-icon icon="local_shipping" size={3} aria-hidden="true" />
            <span
              className="vads-u-margin-left--2"
              data-testid="shipping-date"
              data-dd-privacy="mask"
            >
              Shipped on{' '}
              {dateFormat(
                latestTrackingStatus.completeDateTime,
                'MMMM D, YYYY',
              )}
            </span>
          </p>
        )}
        {rx.dispStatus !== 'Unknown' && (
          <p
            id={`status-${rx.prescriptionId}`}
            className="vads-u-margin-top--1p5 vads-u-font-weight--bold"
            data-testid="rxStatus"
            data-dd-privacy="mask"
          >
            {rx.dispStatus !== 'Active: Refill in Process'
              ? rx.dispStatus
              : 'Active: Refill in process'}
          </p>
        )}
        {rx && <ExtraDetails {...rx} />}
        {rx && <FillRefillButton {...rx} />}
      </>
    );
  };

  return (
    <div
      className={`no-print rx-card-container ${
        pendingMed || pendingRenewal
          ? 'vads-u-background-color--gray-lightest'
          : 'vads-u-background-color--white'
      } vads-u-margin-y--2 vads-u-border--1px vads-u-border-color--base-dark no-break`}
    >
      <div
        className="rx-card-details vads-u-padding--2"
        data-testid="rx-card-info"
      >
        <Link
          id={`card-header-${rx.prescriptionId}`}
          aria-describedby={
            pendingMed || pendingRenewal
              ? `prescription-number-${rx.prescriptionId} pending-med-content-${
                  rx.prescriptionId
                }`
              : `status-${rx.prescriptionId} status-description-${
                  rx.prescriptionId
                } fill-or-refill-button-${rx.prescriptionId}`
          }
          data-dd-privacy="mask"
          data-dd-action-name={
            dataDogActionNames.medicationsListPage.MEDICATION_NAME_LINK_IN_CARD
          }
          data-testid="medications-history-details-link"
          className="vads-u-font-weight--bold"
          to={`prescription/${rx.prescriptionId}`}
        >
          <span data-dd-privacy="mask">
            {rx.prescriptionName ||
              (rx.dispStatus === 'Active: Non-VA' ? rx.orderableItem : '')}
          </span>
        </Link>
        {!pendingMed &&
          !pendingRenewal &&
          rx.dispStatus !== 'Unknown' &&
          rx.dispStatus !== 'Active: Non-VA' && (
            <p
              data-testid="rx-number"
              data-dd-privacy="mask"
              id={`prescription-number-${rx.prescriptionId}`}
            >
              Prescription number:{' '}
              <span data-dd-privacy="mask">{rx.prescriptionNumber}</span>
            </p>
          )}
        {cardBodyContent()}
      </div>
    </div>
  );
};

export default MedicationsListCard;

MedicationsListCard.propTypes = {
  rx: PropTypes.object,
};
