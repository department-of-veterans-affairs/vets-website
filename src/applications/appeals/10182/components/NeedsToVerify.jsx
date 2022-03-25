import React from 'react';
import PropTypes from 'prop-types';

const NeedsToVerify = ({ pathname }) => (
  <va-alert status="warning">
    <h2 slot="headline">We need you to verify your identity</h2>
    You’ll be able to complete this form after your identity is confirmed. This
    helps us keep your information safe during the application process.
    <p>
      <a href={`/verify?next=${pathname}`} className="verify-link">
        Verify your identity
      </a>
    </p>
  </va-alert>
);

NeedsToVerify.propTypes = {
  pathname: PropTypes.string,
};

export default NeedsToVerify;
