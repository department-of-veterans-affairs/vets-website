import PropTypes from 'prop-types';
import React from 'react';

import { ReviewPageTemplate } from '@bio-aquia/shared/components/templates/review-page-template';
import { ReviewAddressField } from '@bio-aquia/shared/components/atoms/review-address-field';

/**
 * Review page component for mailing address.
 * Displays the organization's mailing address.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.data - Full form data
 * @param {Function} props.editPage - Function to enter edit mode
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review page content
 */
export const MailingAddressReviewPage = ({ data, editPage, title }) => {
  const sectionData = data?.mailingAddress || {};

  const formatAddress = address => {
    if (!address) return 'Not provided';

    const { street, city, state, postalCode } = address;
    if (!street && !city && !state && !postalCode) return 'Not provided';

    const parts = [];
    if (street) parts.push(street);
    if (city && state) {
      parts.push(`${city}, ${state}`);
    } else if (city) {
      parts.push(city);
    } else if (state) {
      parts.push(state);
    }
    if (postalCode) parts.push(postalCode);

    return parts.length > 0 ? parts.join('\n') : 'Not provided';
  };

  return (
    <ReviewPageTemplate
      title={title}
      data={data}
      editPage={editPage}
      sectionName="mailingAddress"
    >
      <ReviewAddressField
        label="Mailing address"
        value={sectionData.recipientAddress}
        formatter={formatAddress}
        hideWhenEmpty
      />
    </ReviewPageTemplate>
  );
};

MailingAddressReviewPage.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
