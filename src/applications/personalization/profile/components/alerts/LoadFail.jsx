import React from 'react';
import PropTypes from 'prop-types';

export const fieldFailureMessage = (
  <span>
    We’re sorry. We can’t access this information right now. Please refresh the
    page or try again.
  </span>
);

export default function LoadFail({ information }) {
  return (
    <va-alert status="warning" visible data-testid="service-is-down-banner">
      <h2 slot="headline">
        We can’t access your ${information} information right now.
      </h2>
      <p>
        We’re sorry. Something went wrong on our end. Please refresh this page
        or try again later.
      </p>
    </va-alert>
  );
}

LoadFail.propTypes = {
  information: PropTypes.string.isRequired,
};
