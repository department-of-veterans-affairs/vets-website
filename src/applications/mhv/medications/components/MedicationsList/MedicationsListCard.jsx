import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import FillRefillButton from '../shared/FillRefillButton';
import ExtraDetails from '../shared/ExtraDetails';
import LastFilledInfo from '../shared/LastFilledInfo';
import { dispStatusForRefillsLeft } from '../../util/constants';
import { setBreadcrumbs } from '../../actions/breadcrumbs';

const MedicationsListCard = props => {
  const dispatch = useDispatch();
  const location = useLocation();
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
  const handleLinkClick = () => {
    dispatch(
      setBreadcrumbs(
        [
          {
            url: '/my-health/medications/about',
            label: 'About medications',
          },
          {
            url: `/my-health/medications${location.pathname}`,
            label: 'Medications',
          },
        ],
        {
          url: `/my-health/medications/prescription/${rx.prescriptionId}`,
          label:
            rx?.prescriptionName ||
            (rx?.dispStatus === 'Active: Non-VA' ? rx?.orderableItem : ''),
        },
      ),
    );
  };
  return (
    <div className="no-print rx-card-container vads-u-background-color--white vads-u-margin-y--2 vads-u-border--1px vads-u-border-color--gray-medium no-break">
      <div
        className="rx-card-details vads-u-padding--2"
        data-testid="rx-card-info"
      >
        <h3
          aria-describedby="status status-description fill-or-refill-button"
          className="vads-u-font-weight--bold"
          id={`card-header-${rx.prescriptionId}`}
        >
          <Link
            data-testid="medications-history-details-link"
            className="vads-u-margin-y--0p5 vads-u-font-size--h4"
            to={`/prescription/${rx.prescriptionId}`}
            onClick={handleLinkClick}
          >
            {rx.prescriptionName ||
              (rx.dispStatus === 'Active: Non-VA' ? rx.orderableItem : '')}
          </Link>
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
