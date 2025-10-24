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
 * When veteran is the claimant, displays veteran information.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.data - Full form data
 * @param {Function} props.editPage - Function to enter edit mode
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review page content
 */
export const ClaimantInformationReviewPage = ({ data, editPage, title }) => {
  // Check if veteran is the claimant
  const isVeteranClaimant =
    data?.claimantRelationship?.claimantRelationship === 'veteran';

  // Display veteran data if veteran is claimant, otherwise show claimant data
  const displayData = isVeteranClaimant
    ? {
        claimantFullName: data?.veteranIdentification?.veteranFullName,
        claimantDOB: data?.veteranIdentification?.veteranDOB,
      }
    : data?.claimantInformation || {};

  const nameLabel = isVeteranClaimant
    ? "Veteran's full name (claimant)"
    : "Claimant's full name";

  return (
    <ReviewPageTemplate
      title={title}
      data={data}
      editPage={editPage}
      sectionName="claimantInformation"
    >
      <ReviewFullnameField
        label={nameLabel}
        value={displayData.claimantFullName}
        hideWhenEmpty
      />
      <ReviewDateField
        label="Date of birth"
        value={displayData.claimantDOB}
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
