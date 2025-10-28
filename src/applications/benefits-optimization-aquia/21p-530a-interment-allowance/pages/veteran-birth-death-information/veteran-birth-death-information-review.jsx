import PropTypes from 'prop-types';
import React from 'react';

import { ReviewPageTemplate } from '@bio-aquia/shared/components/templates/review-page-template';
import { ReviewField } from '@bio-aquia/shared/components/atoms/review-field';

/**
 * Review page component for veteran birth and death information.
 * Displays the veteran's date of birth, place of birth, and date of death.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.data - Full form data
 * @param {Function} props.editPage - Function to enter edit mode
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review page content
 */
export const VeteranBirthDeathInformationReviewPage = ({
  data,
  editPage,
  title,
}) => {
  const sectionData = data?.veteranIdentification || {};

  const formatDate = dateString => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPlaceOfBirth = placeOfBirth => {
    if (!placeOfBirth) return '';
    const { city, state } = placeOfBirth;
    if (!city && !state) return '';
    if (city && state) return `${city}, ${state}`;
    return city || state || '';
  };

  return (
    <ReviewPageTemplate
      title={title}
      data={data}
      editPage={editPage}
      sectionName="veteranIdentification"
    >
      <ReviewField
        label="Veteran's date of birth"
        value={sectionData.dateOfBirth}
        formatter={formatDate}
        hideWhenEmpty
      />
      <ReviewField
        label="Place of birth"
        value={sectionData.placeOfBirth}
        formatter={formatPlaceOfBirth}
        hideWhenEmpty
      />
      <ReviewField
        label="Veteran's date of death"
        value={sectionData.dateOfDeath}
        formatter={formatDate}
        hideWhenEmpty
      />
    </ReviewPageTemplate>
  );
};

VeteranBirthDeathInformationReviewPage.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
