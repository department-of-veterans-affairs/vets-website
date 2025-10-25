import PropTypes from 'prop-types';
import React from 'react';

import { ReviewPageTemplate } from '@bio-aquia/shared/components/templates/review-page-template';
import { ReviewDateField } from '@bio-aquia/shared/components/atoms';

/**
 * Review page component for hospitalization date.
 * Displays the admission date to the hospital.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.data - Full form data
 * @param {Function} props.editPage - Function to enter edit mode
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review page content
 */
export const HospitalizationDateReviewPage = ({ data, editPage, title }) => {
  const sectionData = data?.hospitalizationDate || {};

  return (
    <ReviewPageTemplate
      title={title}
      data={data}
      editPage={editPage}
      sectionName="hospitalizationDate"
    >
      <ReviewDateField
        label="Admission date"
        value={sectionData.admissionDate}
        hideWhenEmpty
      />
    </ReviewPageTemplate>
  );
};

HospitalizationDateReviewPage.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
