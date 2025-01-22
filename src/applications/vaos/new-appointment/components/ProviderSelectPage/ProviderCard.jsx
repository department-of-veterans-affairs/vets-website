import React from 'react';
import PropTypes from 'prop-types';

export default function ProviderCard({ provider }) {
  return (
    <div>
      <h2 className="vads-u-font-size--h3 vads-u-margin-bottom--0 vads-u-margin-top--2">
        {provider.name}
      </h2>
      <p className="vads-u-margin-top--0 vads-u-margin-bottom--1">
        Your last appointment was on {provider.lastAppointment}
      </p>
      <va-link active href="#" text="Choose your preferred date and time" />
      <hr
        aria-hidden="true"
        className="vads-u-margin-bottom--2 vads-u-margin-top--2"
      />
    </div>
  );
}

ProviderCard.propTypes = {
  provider: PropTypes.object,
};
