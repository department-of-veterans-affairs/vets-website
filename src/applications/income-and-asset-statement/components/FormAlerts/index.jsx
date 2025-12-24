import React from 'react';
import PropTypes from 'prop-types';
import {
  hasIncompleteTrust,
  isReviewAndSubmitPage,
  showUpdatedContent,
} from '../../helpers';
import { SupportingDocumentsNeededList } from '../OwnedAssetsDescriptions';

export const TrustSupplementaryFormsAlert = ({ formData, headingLevel }) => {
  const trusts = formData?.trusts || [];
  const updatedContent = showUpdatedContent();

  // Hide when no trusts exist
  if (trusts.length === 0) return null;

  // Hide when updatedContent is true and all trusts are complete
  if (updatedContent && !hasIncompleteTrust(trusts)) return null;

  const Heading = headingLevel || (isReviewAndSubmitPage() ? 'h3' : 'h2');

  return (
    <va-alert status="info">
      <Heading slot="headline">Additional documents needed</Heading>

      {updatedContent ? (
        <>
          <p>You added a trust but didn’t upload documents to show:</p>
          <SupportingDocumentsNeededList />
          <p className="vads-u-margin-bottom--0">
            You’ll need to send them by mail.
          </p>
        </>
      ) : (
        <p className="vads-u-margin-bottom--0">
          You’ve added a trust, so you’ll need to submit supporting documents.
          You can upload them at a later part of this process.
        </p>
      )}
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
