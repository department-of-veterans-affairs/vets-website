import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FillRefillButton from '../shared/FillRefillButton';
import ExtraDetails from '../shared/ExtraDetails';
import LastFilledInfo from '../shared/LastFilledInfo';
import {
  dispStatusForRefillsLeft,
  DD_ACTIONS_PAGE_TYPE,
} from '../../util/constants';
import { setPrescriptionDetails } from '../../actions/prescriptions';
import { selectRefillContentFlag } from '../../util/selectors';

const MedicationsListCard = ({ rx }) => {
  const dispatch = useDispatch();
  const showRefillContent = useSelector(selectRefillContentFlag);
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
          data-dd-action-name={`Medication Name Link In Card - ${
            DD_ACTIONS_PAGE_TYPE.LIST
          }`}
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
