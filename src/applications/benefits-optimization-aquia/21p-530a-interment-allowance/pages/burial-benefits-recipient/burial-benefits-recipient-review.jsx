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

  const formatPhone = phone => {
    if (!phone) return 'Not provided';
    // Format phone number if it's a 10-digit number
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(
        6,
      )}`;
    }
    return phone;
  };

  return (
    <ReviewPageTemplate
      title={title}
      data={data}
      editPage={editPage}
      sectionName="burialBenefitsRecipient"
    >
      <ReviewField
        label="Full name"
        value={sectionData.recipientOrganizationName}
        emptyText="None provided"
        hideWhenEmpty
      />
      <ReviewField
        label="Phone number"
        value={sectionData.recipientPhone}
        formatter={formatPhone}
      />
    </ReviewPageTemplate>
  );
};

BurialBenefitsRecipientReviewPage.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
