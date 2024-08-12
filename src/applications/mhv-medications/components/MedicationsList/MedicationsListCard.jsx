import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FillRefillButton from '../shared/FillRefillButton';
import ExtraDetails from '../shared/ExtraDetails';
import LastFilledInfo from '../shared/LastFilledInfo';
import { dispStatusForRefillsLeft } from '../../util/constants';
import { setPrescriptionDetails } from '../../actions/prescriptions';
import { selectRefillContentFlag } from '../../util/selectors';
import { dateFormat } from '../../util/helpers';
import { dataDogActionNames } from '../../util/dataDogConstants';

const MedicationsListCard = ({ rx }) => {
  const dispatch = useDispatch();
  const showRefillContent = useSelector(selectRefillContentFlag);
  const latestTrackingStatus = rx?.trackingList?.[0];
  let showRefillRemaining = false;

  if (dispStatusForRefillsLeft.includes(rx.dispStatus)) {
    showRefillRemaining = true;
  }
  const refillsRemaining = () => {
    if (rx.refillRemaining === 1) {
      return <p>{rx.refillRemaining} refill left</p>;
    }
    return <p>{rx.refillRemaining} refills left</p>;
  };
  const handleLinkClick = () => {
    dispatch(setPrescriptionDetails(rx));
  };
  return (
    <div className="no-print rx-card-container vads-u-background-color--white vads-u-margin-y--2 vads-u-border--1px vads-u-border-color--gray-medium no-break">
      <div
        className="rx-card-details vads-u-padding--2"
        data-testid="rx-card-info"
      >
        <Link
          id={`card-header-${rx.prescriptionId}`}
          aria-describedby={`status-${rx.prescriptionId} status-description-${
            rx.prescriptionId
          } fill-or-refill-button-${rx.prescriptionId}`}
          data-dd-action-name={
            dataDogActionNames.medicationsListPage.MEDICATION_NAME_LINK_IN_CARD
          }
          data-testid="medications-history-details-link"
          className="vads-u-font-weight--bold"
          to={`/prescription/${rx.prescriptionId}`}
          onClick={handleLinkClick}
        >
          {rx.prescriptionName ||
            (rx.dispStatus === 'Active: Non-VA' ? rx.orderableItem : '')}
        </Link>
        {rx.dispStatus !== 'Unknown' &&
          rx.dispStatus !== 'Active: Non-VA' && (
            <p data-testid="rx-number">
              Prescription number: {rx.prescriptionNumber}
            </p>
          )}
        {rx && <LastFilledInfo {...rx} />}
        {showRefillRemaining && refillsRemaining()}
        {latestTrackingStatus && (
          <p
            className="vads-u-margin-top--1p5 vads-u-padding-bottom--1p5 vads-u-border-bottom--1px vads-u-border-color--gray-lighter"
            data-testid="rx-card-details--shipped-on"
          >
            <va-icon icon="local_shipping" size={3} aria-hidden="true" />
            <span className="vads-u-margin-left--2" data-testid="shipping-date">
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
          >
            {rx.dispStatus !== 'Active: Refill in Process'
              ? rx.dispStatus
              : 'Active: Refill in process'}
          </p>
        )}
        {rx && <ExtraDetails {...rx} />}
        {!showRefillContent && rx && <FillRefillButton {...rx} />}
      </div>
    </div>
  );
};

export default MedicationsListCard;

MedicationsListCard.propTypes = {
  rx: PropTypes.object,
};
