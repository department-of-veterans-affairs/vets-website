import React from 'react';
import PropTypes from 'prop-types';
import { hasIncompleteTrust, isReviewAndSubmitPage } from '../../helpers';
import { SupportingDocumentsNeededList } from '../OwnedAssetsDescriptions';

export const TrustSupplementaryFormsAlert = ({ formData, headingLevel }) => {
  const trusts = formData?.trusts || [];

  // Hide when no trusts exist
  if (trusts.length === 0) return null;

  // Hide when all trusts are complete
  if (!hasIncompleteTrust(trusts)) return null;

  const Heading = headingLevel || (isReviewAndSubmitPage() ? 'h3' : 'h2');

  return (
    <va-alert status="info">
      <Heading slot="headline">Additional documents needed</Heading>
      <p>You added a trust but didn’t upload documents to show:</p>
      <SupportingDocumentsNeededList />
      <p className="vads-u-margin-bottom--0">
        You’ll need to send them by mail.
      </p>
    </va-alert>
  );
};

TrustSupplementaryFormsAlert.propTypes = {
  formData: PropTypes.shape({
    trusts: PropTypes.arrayOf(
      PropTypes.shape({
        'view:addFormQuestion': PropTypes.bool,
      }),
    ),
  }),
  headingLevel: PropTypes.oneOf(['h2', 'h3']),
};
