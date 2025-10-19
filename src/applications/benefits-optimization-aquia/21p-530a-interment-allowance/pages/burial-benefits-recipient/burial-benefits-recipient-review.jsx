import PropTypes from 'prop-types';
import React from 'react';

import { ReviewPageTemplate } from '@bio-aquia/shared/components/templates/review-page-template';
import { ReviewField } from '@bio-aquia/shared/components/atoms/review-field';

/**
 * Review page component for burial benefits recipient.
 * Displays who will receive the burial benefits.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.data - Full form data
 * @param {Function} props.editPage - Function to enter edit mode
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review page content
 */
export const BurialBenefitsRecipientReviewPage = ({
  data,
  editPage,
  title,
}) => {
  const sectionData = data?.burialBenefitsRecipient || {};

  const formatRecipient = value => {
    const labels = {
      claimant: 'Claimant (person completing this form)',
      other: 'Other',
    };
    return labels[value] || value;
  };

  return (
    <ReviewPageTemplate
      title={title}
      data={data}
      editPage={editPage}
      sectionName="burialBenefitsRecipient"
    >
      <ReviewField
        label="Who should receive the burial benefits?"
        value={sectionData.recipient}
        formatter={formatRecipient}
        hideWhenEmpty
      />
    </ReviewPageTemplate>
  );
};

BurialBenefitsRecipientReviewPage.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
