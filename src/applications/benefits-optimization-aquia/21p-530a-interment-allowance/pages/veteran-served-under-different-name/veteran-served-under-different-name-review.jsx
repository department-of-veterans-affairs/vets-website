import PropTypes from 'prop-types';
import React from 'react';

import { ReviewPageTemplate } from '@bio-aquia/shared/components/templates/review-page-template';
import { ReviewField } from '@bio-aquia/shared/components/atoms/review-field';

/**
 * Review page component for veteran served under different name.
 * Displays whether the veteran served under a different name.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.data - Full form data
 * @param {Function} props.editPage - Function to enter edit mode
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review page content
 */
export const VeteranServedUnderDifferentNameReviewPage = ({
  data,
  editPage,
  title,
}) => {
  const sectionData = data?.veteranServedUnderDifferentName || {};

  const formatAnswer = value => {
    if (value === 'yes') return 'Yes';
    if (value === 'no') return 'No';
    return value;
  };

  return (
    <ReviewPageTemplate
      title={title}
      data={data}
      editPage={editPage}
      sectionName="veteranServedUnderDifferentName"
    >
      <ReviewField
        label="Did the Veteran serve under a different name?"
        value={sectionData.veteranServedUnderDifferentName}
        formatter={formatAnswer}
        hideWhenEmpty
      />
    </ReviewPageTemplate>
  );
};

VeteranServedUnderDifferentNameReviewPage.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
