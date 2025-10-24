import PropTypes from 'prop-types';
import React from 'react';

import { ReviewPageTemplate } from '@bio-aquia/shared/components/templates/review-page-template';
import {
  ReviewField,
  ReviewAddressField,
} from '@bio-aquia/shared/components/atoms';

/**
 * Review page component for hospitalization facility.
 * Displays the hospital name and address.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.data - Full form data
 * @param {Function} props.editPage - Function to enter edit mode
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review page content
 */
export const HospitalizationFacilityReviewPage = ({
  data,
  editPage,
  title,
}) => {
  const sectionData = data?.hospitalizationFacility || {};

  return (
    <ReviewPageTemplate
      title={title}
      data={data}
      editPage={editPage}
      sectionName="hospitalizationFacility"
    >
      <ReviewField
        label="Name of hospital"
        value={sectionData.facilityName}
        hideWhenEmpty
      />
      <ReviewAddressField
        label="Hospital address"
        value={sectionData.facilityAddress}
        hideWhenEmpty
      />
    </ReviewPageTemplate>
  );
};

HospitalizationFacilityReviewPage.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
