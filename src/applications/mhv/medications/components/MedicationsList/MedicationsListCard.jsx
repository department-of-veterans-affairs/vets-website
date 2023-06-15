import React from 'react';
import PropTypes from 'prop-types';

const MedicationsListCard = props => {
  const { rx } = props;

  return (
    <div className="rx-card-container vads-u-background-color--gray-lightest vads-u-margin-y--1">
      <div className="rx-card-detials vads-u-padding--2">
        <h4 className="vads-u-font-weight--bold">{rx.name}</h4>
        <div>Prescription number: {rx.id}</div>
        <div>Refills left: {rx.refillsLeft}</div>
        <div>
          <va-link active href="nolink" text="Medication history and details" />
        </div>
        {rx.history.length > 0 && (
          <div className="shipping-info vads-u-background-color--gray-light">
            <div className="shipping-icon" />
            <div className="shipping-body">
              <div>Your refill has shipped</div>
              <div>
                Expected delivery date is{' '}
                <span className="vads-u-font-weight--bold">May 24, 2023</span>
              </div>
            </div>
          </div>
        )}
        <button type="button">Fill medication</button>
      </div>
    </div>
  );
};

export default MedicationsListCard;

MedicationsListCard.propTypes = {
  rx: PropTypes.object,
};
