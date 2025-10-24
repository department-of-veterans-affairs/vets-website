import PropTypes from 'prop-types';
import React from 'react';

import { ReviewPageTemplate } from '@bio-aquia/shared/components/templates/review-page-template';
import { ReviewField } from '@bio-aquia/shared/components/atoms';

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
  const address = sectionData?.facilityAddress || {};

  const formatAddress = () => {
    if (!address.street && !address.city) {
      return null;
    }

    const parts = [
      address.street,
      address.street2,
      address.street3,
      address.city,
      address.state,
      address.postalCode,
    ].filter(Boolean);

    return parts.join(', ');
  };

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
      <ReviewField
        label="Hospital address"
        value={formatAddress()}
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
