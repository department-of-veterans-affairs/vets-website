import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import FillRefillButton from '../shared/FillRefillButton';
import ExtraDetails from '../shared/ExtraDetails';
import LastFilledInfo from '../shared/LastFilledInfo';
import { dispStatusForRefillsLeft } from '../../util/constants';

const MedicationsListCard = props => {
  const { rx } = props;
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

  return (
    <div className="rx-card-container vads-u-background-color--white vads-u-margin-y--2 vads-u-border--1px vads-u-border-color--gray-medium no-break">
      <div className="rx-card-detials vads-u-padding--2">
        <h3
          aria-describedby="status status-description fill-or-refill-button"
          className="vads-u-font-weight--bold"
          id={`card-header-${rx.prescriptionId}`}
        >
          <Link
            data-testid="medications-history-details-link"
            className="vads-u-margin-y--0p5 vads-u-font-size--h4 no-print"
            to={`/prescription/${rx.prescriptionId}`}
          >
            {rx.prescriptionName ||
              (rx.dispStatus === 'Active: Non-VA' ? rx.orderableItem : '')}
          </Link>
          <p
            className="vads-u-margin-y--0p5 vads-u-font-size--h4 print-only"
            to={`/prescription/${rx.prescriptionId}`}
          >
            {rx.dispStatus === 'Active: Non-VA'
              ? rx.orderableItem
              : rx.prescriptionName}
          </p>
        </h3>
        {rx && <LastFilledInfo {...rx} />}
        {showRefillRemaining && refillsRemaining()}
        {rx.dispStatus !== 'Unknown' && (
          <div
            id="status"
            className="vads-u-margin-top--1p5 vads-u-font-weight--bold"
            data-testid="rxStatus"
          >
            {rx.dispStatus !== 'Active: Refill in Process'
              ? rx.dispStatus
              : 'Active: Refill in process'}
          </div>
        )}
        {rx && <ExtraDetails {...rx} />}
        {rx && <FillRefillButton {...rx} />}
      </div>
    </div>
  );
};

export default MedicationsListCard;

MedicationsListCard.propTypes = {
  rx: PropTypes.object,
};
