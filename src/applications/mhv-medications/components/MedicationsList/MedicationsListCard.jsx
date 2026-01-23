import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom-v5-compat';
import ExtraDetails from '../shared/ExtraDetails';
import LastFilledInfo from '../shared/LastFilledInfo';
import { dateFormat, getRxStatus, rxSourceIsNonVA } from '../../util/helpers';
import { dataDogActionNames, pageType } from '../../util/dataDogConstants';
import {
  DATETIME_FORMATS,
  RX_SOURCE,
  DISPENSE_STATUS,
} from '../../util/constants';

const MedicationsListCard = ({ rx }) => {
  const pendingMed =
    rx.prescriptionSource === RX_SOURCE.PENDING_DISPENSE &&
    rx?.dispStatus === DISPENSE_STATUS.NEW_ORDER;
  const pendingRenewal =
    rx.prescriptionSource === RX_SOURCE.PENDING_DISPENSE &&
    rx?.dispStatus === DISPENSE_STATUS.RENEW;
  const latestTrackingStatus = rx?.trackingList?.[0];
  const isNonVaPrescription = rxSourceIsNonVA(rx);
  const rxStatus = getRxStatus(rx);

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
            className="vads-u-margin-top--1p5 vads-u-padding-bottom--1p5 vads-u-border-bottom--1px vads-u-border-color--gray"
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
                DATETIME_FORMATS.longMonthDate,
              )}
            </span>
          </p>
        )}
        {rxStatus !== 'Unknown' && (
          <p
            id={`status-${rx.prescriptionId}`}
            className="vads-u-margin-top--1p5 vads-u-font-weight--bold"
            data-testid="rxStatus"
            data-dd-privacy="mask"
          >
            {rxStatus}
          </p>
        )}
        {rx && <ExtraDetails {...rx} page={pageType.LIST} />}
      </>
    );
  };

  return (
    <va-card
      class={`no-print rx-card-container ${
        pendingMed || pendingRenewal ? 'pending-med-or-renewal' : ''
      } vads-u-margin-y--2 no-break`}
    >
      <div className="rx-card-details" data-testid="rx-card-info">
        <Link
          id={`card-header-${rx.prescriptionId}`}
          data-dd-privacy="mask"
          data-dd-action-name={
            dataDogActionNames.medicationsListPage.MEDICATION_NAME_LINK_IN_CARD
          }
          data-testid="medications-history-details-link"
          className="vads-u-font-weight--bold"
          to={`prescription/${rx.prescriptionId}`}
        >
          <span data-dd-privacy="mask">
            {rx?.prescriptionName || rx?.orderableItem}
          </span>
        </Link>
        {!pendingMed &&
          !pendingRenewal &&
          rxStatus !== 'Unknown' &&
          !isNonVaPrescription && (
            <p
              data-testid="rx-number"
              data-dd-privacy="mask"
              id={`prescription-number-${rx.prescriptionId}`}
            >
              Prescription number:{' '}
              <span data-dd-privacy="mask">
                {rx.prescriptionNumber || 'Not available'}
              </span>
            </p>
          )}
        {cardBodyContent()}
      </div>
    </va-card>
  );
};

export default MedicationsListCard;

MedicationsListCard.propTypes = {
  rx: PropTypes.object,
};
