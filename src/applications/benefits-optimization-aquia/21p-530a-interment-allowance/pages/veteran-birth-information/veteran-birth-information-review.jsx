import PropTypes from 'prop-types';
import React from 'react';

import { ReviewPageTemplate } from '@bio-aquia/shared/components/templates/review-page-template';
import {
  ReviewDateField,
  ReviewField,
} from '@bio-aquia/shared/components/atoms';

/**
 * Review page component for veteran birth information.
 * Displays the deceased Veteran's date and place of birth.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.data - Full form data
 * @param {Function} props.editPage - Function to enter edit mode
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review page content
 */
export const VeteranBirthInformationReviewPage = ({
  data,
  editPage,
  title,
}) => {
  const sectionData = data?.veteranBirthInformation || {};

  return (
    <ReviewPageTemplate
      title={title}
      data={data}
      editPage={editPage}
      sectionName="veteranBirthInformation"
    >
      <ReviewDateField
        label="Date of birth"
        value={sectionData.dateOfBirth}
        hideWhenEmpty
      />
      <ReviewField
        label="Place of birth"
        value={
          sectionData.placeOfBirth
            ? `${sectionData.placeOfBirth.city}, ${
                sectionData.placeOfBirth.state
              }`
            : null
        }
        hideWhenEmpty
      />
    </ReviewPageTemplate>
  );
};

VeteranBirthInformationReviewPage.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
