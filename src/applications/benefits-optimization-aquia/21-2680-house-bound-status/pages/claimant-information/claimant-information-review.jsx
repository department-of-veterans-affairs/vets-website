import PropTypes from 'prop-types';
import React from 'react';

import { ReviewPageTemplate } from '@bio-aquia/shared/components/templates/review-page-template';
import {
  ReviewDateField,
  ReviewFullnameField,
} from '@bio-aquia/shared/components/atoms';

/**
 * Review page component for claimant information.
 * Displays the claimant's name and date of birth.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.data - Full form data
 * @param {Function} props.editPage - Function to enter edit mode
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review page content
 */
export const ClaimantInformationReviewPage = ({ data, editPage, title }) => {
  const sectionData = data?.claimantInformation || {};

  return (
    <ReviewPageTemplate
      title={title}
      data={data}
      editPage={editPage}
      sectionName="claimantInformation"
    >
      <ReviewFullnameField
        label="Claimant's full name"
        value={sectionData.claimantFullName}
        hideWhenEmpty
      />
      <ReviewDateField
        label="Date of birth"
        value={sectionData.claimantDOB}
        hideWhenEmpty
      />
    </ReviewPageTemplate>
  );
};

ClaimantInformationReviewPage.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
