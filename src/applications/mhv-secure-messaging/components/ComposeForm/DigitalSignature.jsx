import React from 'react';
import PropTypes from 'prop-types';

const DigitalSignature = ({ error, onInput }) => {
  return (
    <va-card background class="vads-u-margin-bottom--5">
      <h2 className="vads-u-font-size--h3 vads-u-margin-top--1">
        Digital signature
      </h2>
      <p>You need to sign all messages to this team.</p>

      <va-text-input
        label="Your full name"
        message-aria-describedby="Digital signature."
        error={error}
        onInput={onInput}
        required
      />
    </va-card>
  );
};

DigitalSignature.propTypes = {
  error: PropTypes.string,
  onInput: PropTypes.func,
};

export default DigitalSignature;
