import React from 'react';
import PropTypes from 'prop-types';
import Prescription from './Prescription';

const TooEarlyToRefillCard = ({ tooEarly = [] }) => (
  <va-card background data-testid="too-early-section">
    <div className="vads-u-padding-x--1">
      <h3 className="vads-u-margin--0">
        <va-icon
          icon="acute"
          size={3}
          class="vads-u-margin-right--1"
          aria-hidden="true"
        />
        Too early to refill
      </h3>
      <p className="vads-u-margin-top--1">
        We shipped refills of these medications to you recently and can’t send
        more right now. You don’t have to do anything. Once we’re able to, we’ll
        ship these medications to you.
      </p>
      {tooEarly.map(prescription => (
        <Prescription key={prescription.prescriptionId} {...prescription} />
      ))}
    </div>
  </va-card>
);

TooEarlyToRefillCard.propTypes = {
  tooEarly: PropTypes.array.isRequired,
};

export default TooEarlyToRefillCard;
