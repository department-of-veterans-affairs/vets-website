import React from 'react';

const DigitalSignature = () => {
  return (
    <va-card background>
      <h2 className="vads-u-font-size--h3 vads-u-margin-top--1">
        Digital signature
      </h2>
      <p />

      <va-text-input
        label="Your full name"
        message-aria-describedby="Digital signature."
        required
      />
    </va-card>
  );
};

export default DigitalSignature;
