import PropTypes from 'prop-types';
import React from 'react';

import { ReviewPageTemplate } from '@bio-aquia/shared/components/templates/review-page-template';
import { ReviewField } from '@bio-aquia/shared/components/atoms';

/**
 * Review page component for claimant SSN.
 * Displays the claimant's Social Security number.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.data - Full form data
 * @param {Function} props.editPage - Function to enter edit mode
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review page content
 */
export const ClaimantSSNReviewPage = ({ data, editPage, title }) => {
  const sectionData = data?.claimantSSN || {};

  return (
    <ReviewPageTemplate
      title={title}
      data={data}
      editPage={editPage}
      sectionName="claimantSSN"
    >
      <ReviewField
        label="Claimant Social Security number"
        value={sectionData.claimantSSN}
        hideWhenEmpty
      />
    </ReviewPageTemplate>
  );
};

ClaimantSSNReviewPage.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
