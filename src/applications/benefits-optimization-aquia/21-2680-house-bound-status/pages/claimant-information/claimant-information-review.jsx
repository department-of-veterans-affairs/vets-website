import PropTypes from 'prop-types';
import React from 'react';

import { ReviewPageTemplate } from '@bio-aquia/shared/components/templates/review-page-template';
import {
  ReviewField,
  ReviewDateField,
  ReviewAddressField,
} from '@bio-aquia/shared/components/atoms';

/**
 * Review page component for all claimant information.
 * Displays all claimant data in a single comprehensive section:
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
    data?.claimantRelationship?.relationship === 'veteran';

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
    relationshipLabels[(data?.claimantRelationship?.relationship)] ||
    data?.claimantRelationship?.relationship;

  // Migrate old field names to new field names for backward compatibility
  // Handle both veteran and claimant data with old camelCase field names
  const veteranDOB =
    data?.veteranIdentification?.veteranDOB ||
    data?.veteranIdentification?.veteranDob ||
    '';
  const veteranSSN =
    data?.veteranIdentification?.veteranSSN ||
    data?.veteranIdentification?.veteranSsn ||
    '';
  const claimantDOBFromSection =
    data?.claimantInformation?.claimantDOB ||
    data?.claimantInformation?.claimantDob ||
    '';
  const claimantSSNFromSection =
    data?.claimantSSN?.claimantSSN ||
    data?.claimantSSN?.claimantSsn ||
    data?.claimantSsn?.claimantSSN ||
    data?.claimantSsn?.claimantSsn ||
    '';

  // Get claimant data (use veteran data if veteran is claimant)
  const claimantName = isVeteranClaimant
    ? data?.veteranIdentification?.veteranFullName
    : data?.claimantInformation?.claimantFullName;

  const claimantDOB = isVeteranClaimant ? veteranDOB : claimantDOBFromSection;

  const claimantSSN = isVeteranClaimant ? veteranSSN : claimantSSNFromSection;

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

          <ReviewDateField
            label="Claimant's date of birth"
            value={claimantDOB}
            hideWhenEmpty
          />

          <ReviewField
            label="Claimant's Social Security number"
            value={claimantSSN}
            hideWhenEmpty
          />

          <ReviewAddressField
            label="Claimant's address"
            value={claimantAddress}
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
