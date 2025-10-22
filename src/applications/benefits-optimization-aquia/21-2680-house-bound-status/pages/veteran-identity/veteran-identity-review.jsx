import PropTypes from 'prop-types';
import React from 'react';

import { ReviewPageTemplate } from '@bio-aquia/shared/components/templates/review-page-template';
import {
  ReviewDateField,
  ReviewField,
  ReviewFullnameField,
} from '@bio-aquia/shared/components/atoms';

/**
 * Review page component for veteran identity.
 * Displays the Veteran's identification information.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.data - Full form data
 * @param {Function} props.editPage - Function to enter edit mode
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review page content
 */
export const VeteranIdentityReviewPage = ({ data, editPage, title }) => {
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
        value={sectionData.veteranFullName}
        hideWhenEmpty
      />
      <ReviewField
        label="Social Security number"
        value={sectionData.veteranSSN}
        hideWhenEmpty
      />
      <ReviewDateField
        label="Date of birth"
        value={sectionData.veteranDOB}
        hideWhenEmpty
      />
    </ReviewPageTemplate>
  );
};

VeteranIdentityReviewPage.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
