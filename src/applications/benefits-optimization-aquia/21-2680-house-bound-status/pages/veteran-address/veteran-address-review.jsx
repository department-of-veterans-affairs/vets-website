import PropTypes from 'prop-types';
import React from 'react';

import { ReviewPageTemplate } from '@bio-aquia/shared/components/templates/review-page-template';
import { ReviewAddressField } from '@bio-aquia/shared/components/atoms/review-address-field';

/**
 * Review page component for veteran address.
 * Displays the Veteran's mailing address.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.data - Full form data
 * @param {Function} props.editPage - Function to enter edit mode
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review page content
 */
export const VeteranAddressReviewPage = ({ data, editPage, title }) => {
  const sectionData = data?.veteranAddress || {};

  return (
    <ReviewPageTemplate
      title={title}
      data={data}
      editPage={editPage}
      sectionName="veteranAddress"
    >
      <ReviewAddressField
        label="Veteran's mailing address"
        value={sectionData.veteranAddress}
        hideWhenEmpty
      />
    </ReviewPageTemplate>
  );
};

VeteranAddressReviewPage.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
