import PropTypes from 'prop-types';
import React from 'react';

import { ReviewPageTemplate } from '@bio-aquia/shared/components/templates/review-page-template';
import { ReviewField } from '@bio-aquia/shared/components/atoms/review-field';

/**
 * Review page component for additional remarks.
 * Displays any additional information provided by the user.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.data - Full form data
 * @param {Function} props.editPage - Function to enter edit mode
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review page content
 */
export const AdditionalRemarksReviewPage = ({ data, editPage, title }) => {
  const sectionData = data?.additionalRemarks || {};

  return (
    <ReviewPageTemplate
      title={title}
      data={data}
      editPage={editPage}
      sectionName="additionalRemarks"
    >
      <ReviewField
        label="Additional remarks"
        value={sectionData.additionalRemarks}
        emptyText="None provided"
        hideWhenEmpty
      />
    </ReviewPageTemplate>
  );
};

AdditionalRemarksReviewPage.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
