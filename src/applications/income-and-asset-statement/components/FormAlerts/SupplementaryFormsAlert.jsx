import React from 'react';
import { connect } from 'react-redux';

const assetTypeWhitelist = ['BUSINESS', 'FARM'];

export const getAssetTypes = assets => {
  if (assets.length === 0) return [];
  const assetTypes = new Set();

  assets.forEach(asset => {
    const { assetType } = asset;

    if (assetType && assetTypeWhitelist.includes(assetType)) {
      assetTypes.add(assetType.toLowerCase());
    }
  });

  return Array.from(assetTypes).sort();
};

const getJoiner = (assets, options) => {
  if (assets.length === 1) return options[0];

  let assetCount = 0;

  for (const asset of assets) {
    const { assetType } = asset;

    if (assetType && assetTypeWhitelist.includes(assetType)) {
      assetCount += 1;
    }

    if (assetCount > 1) break;
  }

  return assetCount > 1 ? options[1] : options[0];
};

const bodyTextMap = {
  business: 'Report of Income from Property or Business (VA Form 21P-4185)',
  farm: 'Pension Claim Questionnaire for Farm Income (VA Form 21P-4165)',
};

const downloadLinkMap = {
  business: {
    href: 'https://www.va.gov/find-forms/about-form-21p-4185/',
    text: 'Get VA Form 21P-4185',
  },
  farm: {
    href: 'https://www.va.gov/find-forms/about-form-21p-4165/',
    text: 'Get VA Form 21P-4165',
  },
};

export const SupplementaryFormsAlert = ({ formData }) => {
  const assets = formData?.ownedAssets || [];

  const assetTypes = getAssetTypes(assets);
  if (assets.length === 0 || assetTypes.length === 0) return null;

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

  const headline = `Additional ${getJoiner(assets, ['form', 'forms'])} needed`;
  const bodyText = bodyTextParts.join('');

  return (
    <va-alert status="info">
      <h2 slot="headline">{headline}</h2>
      <p>{bodyText}</p>
      {assetTypes.map(type => (
        <p key={type}>
          <a
            aria-label={downloadLinkMap[type].text}
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
};

const mapStateToProps = state => ({
  formData: state.form?.data,
});

export default connect(
  mapStateToProps,
  null,
)(SupplementaryFormsAlert);
