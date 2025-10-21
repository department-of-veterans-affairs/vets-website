import PropTypes from 'prop-types';
import React from 'react';

import { ReviewPageTemplate } from '@bio-aquia/shared/components/templates/review-page-template';
import {
  ReviewField,
  ReviewFullnameField,
} from '@bio-aquia/shared/components/atoms';

/**
 * Review page component for veteran personal information.
 * Displays the deceased Veteran's name, Social Security number, VA service number, and VA file number.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.data - Full form data
 * @param {Function} props.editPage - Function to enter edit mode
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review page content
 */
export const VeteranPersonalInformationReviewPage = ({
  data,
  editPage,
  title,
}) => {
  const sectionData = data?.veteranPersonalInformation || {};

  return (
    <ReviewPageTemplate
      title={title}
      data={data}
      editPage={editPage}
      sectionName="veteranPersonalInformation"
    >
      <ReviewFullnameField
        label="Full name"
        value={sectionData.fullName}
        hideWhenEmpty
      />
      <ReviewField
        label="Social Security number"
        value={sectionData.ssn}
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

VeteranPersonalInformationReviewPage.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
