// Experimenting with allowing multiple claims - DO NOT MERGE TO STAGING
import get from 'platform/utilities/data/get';
import React from 'react';
import {
  titleUI,
  titleSchema,
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import { nameWording } from '../../shared/utilities';

import {
  claimWorkSchema,
  claimAutoSchema,
  medicalClaimUploadSchema,
  // eobUploadSchema,
  // pharmacyClaimUploadSchema,
  // TestUploadPage,
} from './claimInformation';

const yesNoContent = {
  title: 'Do you have another claim to add?',
  labels: {
    Y: 'Yes',
    N: 'No',
  },
  hint: '',
  labelHeaderLevel: '5',
};

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'claims',
  nounSingular: 'claim',
  nounPlural: 'claims',
  required: true,
  isItemIncomplete: item => {
    return (
      !item.claimIsAutoRelated &&
      !item.claimIsWorkRelated &&
      !item.claimType &&
      !(item.medicalUpload || !item.pharmacyUpload)
    );
  }, // include all required fields here
  maxItems: 5,
  text: {
    getItemName: item => item.name,
    cardDescription: (item, _index) =>
      `${item?.claimType &&
        item?.claimType[0]?.toUpperCase() + item?.claimType?.slice(1)} claim`,
    summaryTitle: 'Beneficiary claims review',
    cancelAddButtonText: 'Cancel adding this claim',
  },
};

const claimTypePage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: `${options.nounSingular} information`,
      description: `You can add up to ${options?.maxItems} ${
        options?.nounPlural
      }.`,
      nounSingular: options.nounSingular,
    }),
    claimType: radioUI({
      title: 'What type of claim are you submitting?',
      labels: {
        medical: 'I’m submitting a claim for medical care from a provider',
        pharmacy: 'I’m submitting a claim for prescription medications',
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['claimType'],
    properties: {
      titleSchema,
      claimType: radioSchema(['medical', 'pharmacy']),
    },
  },
};

const summaryPage = {
  uiSchema: {
    'view:hasClaims': arrayBuilderYesNoUI(options, yesNoContent, yesNoContent),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasClaims': arrayBuilderYesNoSchema,
    },
    required: ['view:hasClaims'],
  },
};

// Main pages object
export const claimsPages = arrayBuilderPages(options, pageBuilder => ({
  claimsIntro: pageBuilder.introPage({
    path: 'claims-intro',
    title: '[noun plural]',
    uiSchema: {
      ...titleUI('Claims information', ({ formData }) => (
        <p>
          Next we’ll ask you to enter information about{' '}
          {nameWording(formData, true, false, true)} claims.
          <br />
          <br />
          You can add up to five claims.
        </p>
      )),
    },
    schema: {
      type: 'object',
      properties: {
        titleSchema,
      },
    },
  }),
  claimsSummary: pageBuilder.summaryPage({
    title: 'Review your [noun plural]',
    path: 'claims-review',
    ...summaryPage,
  }),
  claimType: pageBuilder.itemPage({
    title: 'Claim type',
    path: 'claim-type/:index',
    ...claimTypePage,
  }),
  claimWork: pageBuilder.itemPage({
    title: 'Claim relation to work',
    path: 'claim-work/:index',
    ...claimWorkSchema,
  }),
  claimAuto: pageBuilder.itemPage({
    title: 'Claim relation to auto accident',
    path: 'claim-auto/:index',
    ...claimAutoSchema,
  }),
  claimMedUpload: pageBuilder.itemPage({
    title: 'Medical claim supporting documents',
    path: 'claim-med-upload/:index',
    depends: (formData, idx) => {
      return get('claimType', formData?.claims?.[idx]) === 'medical';
    },
    ...medicalClaimUploadSchema,
  }),
  //   claimEobUpload: pageBuilder.itemPage({
  //     title: 'Medical claim EOB upload',
  //     path: 'claim-eob-upload/:index',
  //     depends: (formData, idx) =>
  //       get('claimType', formData?.claims?.[idx]) === 'medical',
  //     ...eobUploadSchema(true),
  //   }),
  //   claimAdtlEobUpload: pageBuilder.itemPage({
  //     title: 'Additional Medical claim EOB upload',
  //     path: 'claim-eob-upload-adtl/:index',
  //     depends: (formData, idx) =>
  //       get('claimType', formData?.claims?.[idx]) === 'medical' &&
  //       get('policies', formData?.claims?.[idx]) &&
  //       formData?.policies?.length > 1,
  //     ...eobUploadSchema(false),
  //   }),
  //   claimPharmacyUpload: pageBuilder.itemPage({
  //     title: 'Medical claim pharmacy upload',
  //     path: 'claim-pharma-upload/:index',
  //     depends: (formData, idx) =>
  //       get('claimType', formData?.claims?.[idx]) === 'pharmacy',
  //     ...pharmacyClaimUploadSchema,
  //   }),
}));
