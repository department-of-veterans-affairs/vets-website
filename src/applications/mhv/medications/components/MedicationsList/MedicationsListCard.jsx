import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { dateFormat } from '../../util/helpers';
import FillRefillButton from '../shared/FillRefillButton';
import ExtraDetails from '../shared/ExtraDetails';
import {
  refillStatusForRefillsReft,
  dispStatusForRefillsReft,
} from '../../util/constants';

const MedicationsListCard = props => {
  const { rx } = props;
  let noRefillRemaining = false;
  let showRefillRemaining = false;

  if (
    refillStatusForRefillsReft.includes(rx.refillStatus) &&
    dispStatusForRefillsReft.includes(rx.dispStatus)
  ) {
    showRefillRemaining = true;
  }
  if (rx.refillRemaining === 0 && rx.refillStatus === 'active') {
    noRefillRemaining = true;
  }
  const refillsRemaining = () => {
    if (rx.refillRemaining === 1) {
      return <p>{rx.refillRemaining} refill left</p>;
    }
    return <p>{rx.refillRemaining} refills left</p>;
  };

  return (
    <div className="rx-card-container vads-u-background-color--white vads-u-margin-y--1 vads-u-border--1px vads-u-border-color--gray-medium no-break">
      <div className="rx-card-detials vads-u-padding--2">
        <h3
          className="vads-u-font-weight--bold"
          id={`card-header-${rx.prescriptionId}`}
        >
          <Link
            className="vads-u-margin-y--0p5 vads-u-font-size--h4"
            to={`/${rx.prescriptionId}`}
            data-testid="medications-history-details-link"
          >
            {rx.prescriptionName}
          </Link>
        </h3>
        {rx.dispensedDate && rx.refillStatus !== 'transferred' ? (
          <p>
            {rx.refillStatus === 'non-va' ? 'Documented' : 'Last filled'} on{' '}
            {dateFormat(rx.dispensedDate, 'MMMM D, YYYY')}
          </p>
        ) : (
          <p>You haven’t filled this prescription yet</p>
        )}
        {showRefillRemaining && refillsRemaining()}
        {rx && <ExtraDetails {...rx} />}
        {rx && <FillRefillButton {...rx} />}

        {noRefillRemaining && (
          <>
            <div className="no-print">
              <p className="vads-u-margin-y--0">
                You have no refills left. If you need more, request a renewal.
              </p>
              <va-link
                href="/my-health/about-medications/accordion-renew-rx"
                text="Learn how to renew prescriptions"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MedicationsListCard;

MedicationsListCard.propTypes = {
  rx: PropTypes.object,
};
