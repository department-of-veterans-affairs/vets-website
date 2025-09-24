import React from 'react';
import PropTypes from 'prop-types';
import { isReviewAndSubmitPage } from '../../helpers';

export const TrustSupplementaryFormsAlert = ({ formData, headingLevel }) => {
  const trusts = formData?.trusts || [];
  if (trusts.length === 0) return null;

  const Heading = headingLevel || (isReviewAndSubmitPage() ? 'h3' : 'h2');

  return (
    <va-alert status="info" visible>
      <Heading slot="headline">Additional documents needed</Heading>
      <p>
        You’ve added a trust, so you’ll need to submit supporting documents. You
        can upload them at a later part of this process.
      </p>
    </va-alert>
  );
};

TrustSupplementaryFormsAlert.propTypes = {
  formData: PropTypes.shape({
    trusts: PropTypes.array,
  }),
  headingLevel: PropTypes.oneOf(['h2', 'h3']),
};
