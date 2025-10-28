import PropTypes from 'prop-types';
import React from 'react';

import { ReviewPageTemplate } from '@bio-aquia/shared/components/templates/review-page-template';
import { ReviewField } from '@bio-aquia/shared/components/atoms/review-field';

/**
 * Review page component for veteran SSN and file number.
 * Displays the veteran's SSN and VA file number.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.data - Full form data
 * @param {Function} props.editPage - Function to enter edit mode
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review page content
 */
export const VeteranSsnFileNumberReviewPage = ({ data, editPage, title }) => {
  const sectionData = data?.veteranIdentification || {};

  const formatSSN = ssn => {
    if (!ssn) return '';
    const cleaned = ssn.replace(/\D/g, '');
    if (cleaned.length === 9) {
      return `***-**-${cleaned.slice(-4)}`;
    }
    return ssn;
  };

  return (
    <ReviewPageTemplate
      title={title}
      data={data}
      editPage={editPage}
      sectionName="veteranIdentification"
    >
      <ReviewField
        label="Social Security number"
        value={sectionData.ssn}
        formatter={formatSSN}
        hideWhenEmpty
      />
      <ReviewField
        label="VA service number"
        value={sectionData.serviceNumber}
        hideWhenEmpty
      />
      <ReviewField
        label="VA file number"
        value={sectionData.vaFileNumber}
        hideWhenEmpty
      />
    </ReviewPageTemplate>
  );
};

VeteranSsnFileNumberReviewPage.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
