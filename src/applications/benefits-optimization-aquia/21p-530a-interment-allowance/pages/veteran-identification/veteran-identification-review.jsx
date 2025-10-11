import PropTypes from 'prop-types';
import React from 'react';

import { ReviewPageTemplate } from '@bio-aquia/shared/components/templates/review-page-template';
import {
  ReviewDateField,
  ReviewField,
  ReviewFullnameField,
} from '@bio-aquia/shared/components/atoms';

/**
 * Review page component for veteran identification.
 * Displays the deceased Veteran's identification information.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.data - Full form data
 * @param {Function} props.editPage - Function to enter edit mode
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review page content
 */
export const VeteranIdentificationReviewPage = ({ data, editPage, title }) => {
  const sectionData = data?.veteranIdentification || {};

  return (
    <ReviewPageTemplate
      title={title}
      data={data}
      editPage={editPage}
      sectionName="veteranIdentification"
    >
      <ReviewFullnameField
        label="Veteran's full name"
        value={sectionData.fullName}
        hideWhenEmpty
      />
      <ReviewField
        label="Veteran's Social Security Number"
        value={sectionData.ssn}
        hideWhenEmpty
      />
      <ReviewField
        label="Veteran's service number"
        value={sectionData.serviceNumber}
        hideWhenEmpty
      />
      <ReviewField
        label="Veteran's VA file number"
        value={sectionData.vaFileNumber}
        hideWhenEmpty
      />
      <ReviewDateField
        label="Veteran's date of birth"
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
      <ReviewDateField
        label="Veteran's date of death"
        value={sectionData.dateOfDeath}
        hideWhenEmpty
      />
    </ReviewPageTemplate>
  );
};

VeteranIdentificationReviewPage.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
