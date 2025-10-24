import PropTypes from 'prop-types';
import React from 'react';

import { ReviewPageTemplate } from '@bio-aquia/shared/components/templates/review-page-template';
import { ReviewField } from '@bio-aquia/shared/components/atoms';

/**
 * Review page component for claimant contact information.
 * Displays the claimant's phone number, mobile phone, and email.
 *
 * Note: When veteran is the claimant, contact information is not collected
 * in veteran pages, so these fields will not display (hideWhenEmpty handles this).
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.data - Full form data
 * @param {Function} props.editPage - Function to enter edit mode
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review page content
 */
export const ClaimantContactReviewPage = ({ data, editPage, title }) => {
  const sectionData = data?.claimantContact || {};

  return (
    <ReviewPageTemplate
      title={title}
      data={data}
      editPage={editPage}
      sectionName="claimantContact"
    >
      <ReviewField
        label="Phone number"
        value={sectionData.claimantPhoneNumber}
        hideWhenEmpty
      />
      <ReviewField
        label="Mobile phone number"
        value={sectionData.claimantMobilePhone}
        hideWhenEmpty
      />
      <ReviewField
        label="Email address"
        value={sectionData.claimantEmail}
        hideWhenEmpty
      />
    </ReviewPageTemplate>
  );
};

ClaimantContactReviewPage.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
