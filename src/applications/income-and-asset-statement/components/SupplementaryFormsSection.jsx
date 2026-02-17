import React from 'react';
import PropTypes from 'prop-types';
import MailingAddress from './MailingAddress';
import { getIncompleteOwnedAssets, hasIncompleteTrust } from '../helpers';
import { SupportingDocumentsNeededList } from './OwnedAssetsDescriptions';

const bodyTextMap = {
  BUSINESS: 'Report of Income from Property or Business (VA Form 21P-4185)',
  FARM: 'Questionnaire for Farm Income (VA Form 21P-4165)',
};

const formLinks = {
  BUSINESS: {
    text: 'Get VA Form 21P-4185 to download',
    href: 'https://www.va.gov/find-forms/about-form-21p-4185/',
  },
  FARM: {
    text: 'Get VA Form 21P-4165 to download',
    href: 'https://www.va.gov/find-forms/about-form-21p-4165/',
  },
};

const getBodyText = ({ hasBusiness, hasFarm, hasTrust }) => {
  const parts = [];

  if (hasBusiness) {
    parts.push(bodyTextMap.BUSINESS);
  }

  if (hasFarm) {
    parts.push(bodyTextMap.FARM);
  }

  if (hasTrust) {
    parts.push('supporting documents for a trust');
  }

  if (parts.length === 0) return null;

  const joined =
    parts.length === 1
      ? parts[0]
      : `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`;

  return `Since you decided to mail your ${joined}, complete the ${
    parts.length > 1 ? 'items' : 'item'
  } and send them to this address:`;
};

/**
 * Renders VA form download links for the provided asset types.
 *
 * @param {string[]} types - Asset types used to determine which form links to render.
 * @returns {JSX.Element[]} Array of rendered link elements.
 */
const renderFormLinks = types => {
  return types
    .filter(type => formLinks[type])
    .map(type => {
      const { text, href } = formLinks[type];
      return (
        <p key={type}>
          <va-link external text={text} href={href} />
        </p>
      );
    });
};

const SupplementaryFormsSection = ({ formData }) => {
  const { alertAssets, hasFarm, hasBusiness } =
    getIncompleteOwnedAssets(formData);
  const hasTrust = hasIncompleteTrust(formData?.trusts);

  if (alertAssets.length === 0 && !hasTrust) return null;

  const bodyText = getBodyText({ hasBusiness, hasFarm, hasTrust });

  const linkTypes = [];
  if (hasBusiness) linkTypes.push('BUSINESS');
  if (hasFarm) linkTypes.push('FARM');

  return (
    <section>
      <h3>Where to mail supporting documents</h3>

      {bodyText && <p>{bodyText}</p>}

      <MailingAddress />

      {linkTypes.length > 0 && renderFormLinks(linkTypes)}

      {hasTrust && (
        <va-additional-info trigger="What supporting documents should I send?">
          <SupportingDocumentsNeededList />
        </va-additional-info>
      )}
    </section>
  );
};

SupplementaryFormsSection.propTypes = {
  formData: PropTypes.shape({
    ownedAssets: PropTypes.arrayOf(
      PropTypes.shape({
        assetType: PropTypes.string,
        'view:addFormQuestion': PropTypes.bool,
        uploadedDocuments: PropTypes.object,
      }),
    ),
    trusts: PropTypes.array,
  }),
};

export default SupplementaryFormsSection;
