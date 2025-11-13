import React from 'react';
import PropTypes from 'prop-types';
import { isReviewAndSubmitPage, getIncompleteOwnedAssets } from '../../helpers';

const assetTypeAllowlist = ['BUSINESS', 'FARM'];

const bodyTextMap = {
  business: 'Report of Income from Property or Business (VA Form 21P-4185)',
  farm: 'Pension Claim Questionnaire for Farm Income (VA Form 21P-4165)',
};

const downloadLinkMap = {
  business: {
    href: 'https://www.va.gov/find-forms/about-form-21p-4185/',
    text: 'Get VA Form 21P-4185 (opens in new tab)',
  },
  farm: {
    href: 'https://www.va.gov/find-forms/about-form-21p-4165/',
    text: 'Get VA Form 21P-4165 (opens in new tab)',
  },
};

// Get a unique list of asset types from the assets array
export const getAssetTypes = assets => {
  if (assets.length === 0) return [];
  const assetTypes = new Set();

  assets.forEach(asset => {
    const { assetType } = asset;

    if (assetType && assetTypeAllowlist.includes(assetType)) {
      assetTypes.add(assetType.toLowerCase());
    }
  });

  return Array.from(assetTypes).sort();
};

// Get the appropriate joiner based on the number of allowlisted assets
// Expects an array of assets and an array of options for singular/plural
const getJoiner = (assets, options) => {
  if (assets.length === 1) return options[0];

  let assetCount = 0;

  for (const asset of assets) {
    const { assetType } = asset;

    if (assetType && assetTypeAllowlist.includes(assetType)) {
      assetCount += 1;
    }

    if (assetCount > 1) break;
  }

  return assetCount > 1 ? options[1] : options[0];
};

const getBodyText = (assets, assetTypes) => {
  const bodyTextParts = [
    `You’ve added a ${assetTypes.join(' and ')}, so you need to fill out a `,
  ];

  assetTypes.forEach((type, index) => {
    if (index > 0) {
      bodyTextParts.push(' and a ');
    }

    bodyTextParts.push(bodyTextMap[type]);
  });

  bodyTextParts.push(
    [
      '. You can upload',
      getJoiner(assets, ['it', 'them']),
      'at a later part of this process.',
    ].join(' '),
  );

  return bodyTextParts.join('');
};

// SupplementaryFormsAlert component
export default function SupplementaryFormsAlert({ formData, headingLevel }) {
  const assets = formData?.ownedAssets || [];

  const assetTypes = getAssetTypes(assets);
  if (assets.length === 0 || assetTypes.length === 0) return null;

  const headline = `Additional ${getJoiner(assets, ['form', 'forms'])} needed`;
  const bodyText = getBodyText(assets, assetTypes);

  const Heading = headingLevel || (isReviewAndSubmitPage() ? 'h3' : 'h2');

  return (
    <va-alert status="info" visible>
      <Heading slot="headline">{headline}</Heading>
      <p>{bodyText}</p>
      {assetTypes.map(type => (
        <p key={type}>
          <a
            href={downloadLinkMap[type].href}
            rel="noopener noreferrer"
            target="_blank"
          >
            {downloadLinkMap[type].text}
          </a>
        </p>
      ))}
    </va-alert>
  );
}

SupplementaryFormsAlert.propTypes = {
  formData: PropTypes.shape({
    ownedAssets: PropTypes.array,
  }),
  headingLevel: PropTypes.oneOf(['h2', 'h3']),
};

export function SupplementaryFormsAlertUpdated({ formData, headingLevel }) {
  const { hasFarm, hasBusiness, missingAssetTypes } = getIncompleteOwnedAssets(
    formData,
  );

  const Heading = headingLevel || (isReviewAndSubmitPage() ? 'h3' : 'h2');

  const renderContent = () => {
    if (hasFarm && hasBusiness) {
      return (
        <div>
          <p>
            You added a business and a farm, but didn’t upload a{' '}
            {bodyTextMap.business} and {bodyTextMap.farm}.
          </p>
          <p>You’ll need to send them by mail.</p>
        </div>
      );
    }

    return missingAssetTypes.map(assetType => {
      const assetTypeDisplay = assetType.toLowerCase();
      const formName = bodyTextMap[assetTypeDisplay];

      return (
        <div key={assetType}>
          <p>
            You added a {assetTypeDisplay} but didn’t upload a {formName} form.
          </p>
          <p>You’ll need to send it by mail.</p>
        </div>
      );
    });
  };

  return (
    <va-alert status="info" visible>
      <Heading slot="headline">Additional form needed</Heading>
      {renderContent()}
    </va-alert>
  );
}

SupplementaryFormsAlertUpdated.propTypes = {
  formData: PropTypes.shape({
    ownedAssets: PropTypes.array,
  }),
  headingLevel: PropTypes.oneOf(['h2', 'h3']),
};
