import PropTypes from 'prop-types';
import React from 'react';

import { ReviewPageTemplate } from '@bio-aquia/shared/components/templates/review-page-template';
import { ReviewField } from '@bio-aquia/shared/components/atoms';

/**
 * Review page component for claimant SSN.
 * Displays the claimant's Social Security number.
 * When veteran is the claimant, displays veteran SSN.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.data - Full form data
 * @param {Function} props.editPage - Function to enter edit mode
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review page content
 */
export const ClaimantSSNReviewPage = ({ data, editPage, title }) => {
  // Check if veteran is the claimant
  const isVeteranClaimant =
    data?.claimantRelationship?.claimantRelationship === 'veteran';

  // Display veteran SSN if veteran is claimant, otherwise show claimant SSN
  const displaySSN = isVeteranClaimant
    ? data?.veteranIdentification?.veteranSSN
    : data?.claimantSSN?.claimantSSN;

  const label = isVeteranClaimant
    ? "Veteran's Social Security number (claimant)"
    : 'Claimant Social Security number';

  return (
    <ReviewPageTemplate
      title={title}
      data={data}
      editPage={editPage}
      sectionName="claimantSSN"
    >
      <ReviewField label={label} value={displaySSN} hideWhenEmpty />
    </ReviewPageTemplate>
  );
};

ClaimantSSNReviewPage.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
