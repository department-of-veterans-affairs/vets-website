import PropTypes from 'prop-types';
import React from 'react';

import { ReviewPageTemplate } from '@bio-aquia/shared/components/templates/review-page-template';
import { ReviewField } from '@bio-aquia/shared/components/atoms';

/**
 * Review page component for claimant relationship.
 * Displays who the claim is for.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.data - Full form data
 * @param {Function} props.editPage - Function to enter edit mode
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review page content
 */
export const ClaimantRelationshipReviewPage = ({ data, editPage, title }) => {
  const sectionData = data?.claimantRelationship || {};

  const relationshipLabel = {
    veteran: 'Myself (I am the Veteran)',
    spouse: 'Spouse',
    child: 'Child',
    parent: 'Parent',
    other: 'Other',
  };

  return (
    <ReviewPageTemplate
      title={title}
      data={data}
      editPage={editPage}
      sectionName="claimantRelationship"
    >
      <ReviewField
        label="Who is the claim for?"
        value={
          relationshipLabel[sectionData.claimantRelationship] ||
          sectionData.claimantRelationship
        }
        hideWhenEmpty
      />
    </ReviewPageTemplate>
  );
};

ClaimantRelationshipReviewPage.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
