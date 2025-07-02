import React from 'react';
import PropTypes from 'prop-types';

export const TrustSupplementaryFormsAlert = ({ formData }) => {
  const trusts = formData?.trusts || [];
  if (trusts.length === 0) return null;
  return (
    <va-alert status="info" visible>
      <h2 slot="headline">Additional documents needed</h2>
      <p>
        You’ve added a trust, so you will need to submit supporting documents.
        You can upload them at a later part of this process.
      </p>
    </va-alert>
  );
};

TrustSupplementaryFormsAlert.propTypes = {
  formData: PropTypes.shape({
    trusts: PropTypes.array,
  }),
};
