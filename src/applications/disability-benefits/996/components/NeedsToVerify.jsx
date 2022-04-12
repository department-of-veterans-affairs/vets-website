import React from 'react';
import PropTypes from 'prop-types';

const NeedsToVerify = ({ pathname }) => (
  <va-alert status="warning">
    <h2 slot="headline">Verify your identity to start your request</h2>
    <p>
      Before we give you access to your personal information, we need to make
      sure that you’re you—and not someone pretending to be you. This helps us
      keep your information safe.
    </p>
    <p>
      <a href={`/verify?next=${pathname}`} className="verify-link">
        Verify your identity to start your request
      </a>
    </p>
  </va-alert>
);

NeedsToVerify.propTypes = {
  pathname: PropTypes.string,
};

export default NeedsToVerify;
