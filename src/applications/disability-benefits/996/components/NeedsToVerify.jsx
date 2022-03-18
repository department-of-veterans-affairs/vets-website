import React from 'react';
import PropTypes from 'prop-types';

const NeedsToVerify = ({ pathname }) => (
  <va-alert status="warning">
    We want to keep your information safe with the highest level of security.
    Please{' '}
    <a href={`/verify?next=${pathname}`} className="verify-link">
      verify your identity
    </a>{' '}
    to access this form.
  </va-alert>
);

NeedsToVerify.propTypes = {
  pathname: PropTypes.string,
};

export default NeedsToVerify;
