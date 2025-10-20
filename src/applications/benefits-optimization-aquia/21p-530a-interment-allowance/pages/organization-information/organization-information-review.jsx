import PropTypes from 'prop-types';
import React from 'react';

import { ReviewPageTemplate } from '@bio-aquia/shared/components/templates/review-page-template';
import { ReviewField } from '@bio-aquia/shared/components/atoms/review-field';

/**
 * Review page component for organization information.
 * Displays the organization's name and representative contact information.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.data - Full form data
 * @param {Function} props.editPage - Function to enter edit mode
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review page content
 */
export const OrganizationInformationReviewPage = ({
  data,
  editPage,
  title,
}) => {
  const sectionData = data?.organizationInformation || {};

  return (
    <ReviewPageTemplate
      title={title}
      data={data}
      editPage={editPage}
      sectionName="organizationInformation"
    >
      <ReviewField
        label="Organization name"
        value={sectionData.organizationName}
        hideWhenEmpty
      />
      <ReviewField
        label="Representative name"
        value={sectionData.representativeName}
        hideWhenEmpty
      />
      <ReviewField
        label="Representative title"
        value={sectionData.representativeTitle}
        hideWhenEmpty
      />
      <ReviewField
        label="Phone number"
        value={sectionData.phoneNumber}
        hideWhenEmpty
      />
      <ReviewField
        label="Email address"
        value={sectionData.emailAddress}
        hideWhenEmpty
      />
    </ReviewPageTemplate>
  );
};

OrganizationInformationReviewPage.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
