import PropTypes from 'prop-types';
import React from 'react';

import { ReviewPageTemplate } from '@bio-aquia/shared/components/templates/review-page-template';
import { ReviewAddressField } from '@bio-aquia/shared/components/atoms/review-address-field';

/**
 * Review page component for claimant address.
 * Displays the claimant's mailing address.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.data - Full form data
 * @param {Function} props.editPage - Function to enter edit mode
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review page content
 */
export const ClaimantAddressReviewPage = ({ data, editPage, title }) => {
  const sectionData = data?.claimantAddress || {};

  return (
    <ReviewPageTemplate
      title={title}
      data={data}
      editPage={editPage}
      sectionName="claimantAddress"
    >
      <ReviewAddressField
        label="Claimant address"
        value={sectionData.claimantAddress}
        hideWhenEmpty
      />
    </ReviewPageTemplate>
  );
};

ClaimantAddressReviewPage.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
