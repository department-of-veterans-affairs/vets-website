import PropTypes from 'prop-types';
import React from 'react';

import { ReviewPageTemplate } from '@bio-aquia/shared/components/templates/review-page-template';
import { ReviewField } from '@bio-aquia/shared/components/atoms/review-field';

/**
 * Review page component for relationship to veteran.
 * Displays the applicant's relationship to the veteran (state cemetery or tribal organization).
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.data - Full form data
 * @param {Function} props.editPage - Function to enter edit mode
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review page content
 */
export const RelationshipToVeteranReviewPage = ({ data, editPage, title }) => {
  const sectionData = data?.relationshipToVeteran || {};

  const formatAnswer = value => {
    if (value === 'state_cemetery') return "I'm from a state cemetery";
    if (value === 'tribal_organization')
      return "I'm from a tribal organization";
    return value;
  };

  return (
    <ReviewPageTemplate
      title={title}
      data={data}
      editPage={editPage}
      sectionName="relationshipToVeteran"
    >
      <ReviewField
        label="What is your relationship to the Veteran?"
        value={sectionData.relationshipToVeteran}
        formatter={formatAnswer}
        hideWhenEmpty
      />
    </ReviewPageTemplate>
  );
};

RelationshipToVeteranReviewPage.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
