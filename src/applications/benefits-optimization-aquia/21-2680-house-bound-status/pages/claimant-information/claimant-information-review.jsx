import PropTypes from 'prop-types';
import React from 'react';

import { ReviewPageTemplate } from '@bio-aquia/shared/components/templates/review-page-template';
import { ReviewField } from '@bio-aquia/shared/components/atoms';

/**
 * Review page component for all claimant information.
 * Displays all claimant data in a single section:
 * - Relationship to veteran
 * - Full name (if not veteran)
 * - Date of birth (if not veteran)
 * - SSN (if not veteran)
 * - Address (if not veteran)
 * - Contact information (if not veteran)
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.data - Full form data
 * @param {Function} props.editPage - Function to enter edit mode
 * @param {string} props.title - Page title
 * @returns {JSX.Element} Review page content
 */
export const ClaimantInformationReviewPage = ({ data, editPage, title }) => {
  const isVeteranClaimant =
    data?.claimantRelationship?.claimantRelationship === 'veteran';

  // Format relationship for display
  const relationshipLabels = {
    veteran: 'Veteran (self)',
    spouse: 'Spouse',
    child: 'Child',
    parent: 'Parent',
    executor: 'Executor/Administrator of Estate',
    other: 'Other',
  };

  const relationship =
    relationshipLabels[(data?.claimantRelationship?.claimantRelationship)] ||
    data?.claimantRelationship?.claimantRelationship;

  // Get claimant data (use veteran data if veteran is claimant)
  const claimantName = isVeteranClaimant
    ? data?.veteranIdentification?.veteranFullName
    : data?.claimantInformation?.claimantFullName;

  const claimantDOB = isVeteranClaimant
    ? data?.veteranIdentification?.veteranDOB
    : data?.claimantInformation?.claimantDOB;

  const claimantSSN = isVeteranClaimant
    ? data?.veteranIdentification?.veteranSSN
    : data?.claimantSSN?.claimantSSN;

  const claimantAddress = isVeteranClaimant
    ? data?.veteranAddress?.veteranAddress
    : data?.claimantAddress?.claimantAddress;

  const claimantContact = data?.claimantContact || {};

  // Format name for display
  const formatName = name => {
    if (!name) return '';
    const parts = [name.first, name.middle, name.last, name.suffix].filter(
      Boolean,
    );
    return parts.join(' ');
  };

  // Format address for display
  const formatAddress = address => {
    if (!address) return '';
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
      sectionName="claimantRelationship"
    >
      <ReviewField
        label="Who is the claim for?"
        value={relationship}
        hideWhenEmpty
      />

      {!isVeteranClaimant && (
        <>
          <ReviewField
            label="Claimant's full name"
            value={formatName(claimantName)}
            hideWhenEmpty
          />

          <ReviewField
            label="Claimant's date of birth"
            value={claimantDOB}
            hideWhenEmpty
          />

          <ReviewField
            label="Claimant's Social Security number"
            value={claimantSSN}
            hideWhenEmpty
          />

          <ReviewField
            label="Claimant's address"
            value={formatAddress(claimantAddress)}
            hideWhenEmpty
          />

          <ReviewField
            label="Claimant's phone number"
            value={claimantContact.claimantPhoneNumber}
            hideWhenEmpty
          />

          <ReviewField
            label="Claimant's mobile phone number"
            value={claimantContact.claimantMobilePhone}
            hideWhenEmpty
          />

          <ReviewField
            label="Claimant's email address"
            value={claimantContact.claimantEmail}
            hideWhenEmpty
          />
        </>
      )}

      {isVeteranClaimant && (
        <p className="vads-u-margin-top--2 vads-u-color--gray-medium">
          The veteran is filing this claim for themselves. Veteran information
          is shown in the "Veteran’s information" section above.
        </p>
      )}
    </ReviewPageTemplate>
  );
};

ClaimantInformationReviewPage.propTypes = {
  data: PropTypes.object.isRequired,
  editPage: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
