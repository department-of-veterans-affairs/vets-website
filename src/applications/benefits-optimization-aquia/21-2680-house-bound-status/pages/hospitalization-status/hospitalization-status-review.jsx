import PropTypes from 'prop-types';
import React from 'react';

import { ReviewPageTemplate } from '@bio-aquia/shared/components/templates/review-page-template';
import { ReviewField } from '@bio-aquia/shared/components/atoms';

/**
 * Review page component for hospitalization status.
 * Displays whether the claimant is currently hospitalized.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.data - Full form data
 * @param {Function} props.editPage - Function to enter edit mode
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review page content
 */
export const HospitalizationStatusReviewPage = ({ data, editPage, title }) => {
  const sectionData = data?.hospitalizationStatus || {};

  const statusLabel = {
    yes: 'Yes',
    no: 'No',
  };

  return (
    <ReviewPageTemplate
      title={title}
      data={data}
      editPage={editPage}
      sectionName="hospitalizationStatus"
    >
      <ReviewField
        label="Is the claimant currently hospitalized?"
        value={
          statusLabel[sectionData.isCurrentlyHospitalized] ||
          sectionData.isCurrentlyHospitalized
        }
        hideWhenEmpty
      />
    </ReviewPageTemplate>
  );
};

HospitalizationStatusReviewPage.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
