import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currentOrPastDateSchema,
  currentOrPastDateUI,
  descriptionUI,
  selectSchema,
  selectUI,
  textSchema,
  textUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

import ProfessionalAffiliationsIntro from '../../components/05-professional-affiliations-chapter/ProfessionalAffiliationsIntro';
import { jurisdictionOptions } from '../../constants/jurisdictions';
import { formatReviewDate } from '../helpers/formatReviewDate';

const dependsOn = formData => formData.standingWithBar;

/** @type {ArrayBuilderOptions} */
const arrayBuilderOptions = {
  arrayPath: 'jurisdictions',
  nounSingular: 'jurisdiction',
  nounPlural: 'jurisdictions',
  required: true,
  isItemIncomplete: item =>
    !item?.jurisdiction ||
    (item?.jurisdiction === 'Other' && !item?.otherJurisdiction) ||
    !item?.admissionDate ||
    !item?.membershipOrRegistrationNumber,
  text: {
    getItemName: item =>
      item?.jurisdiction === 'Other'
        ? item?.otherJurisdiction
        : item?.jurisdiction,
    cardDescription: item =>
      `${formatReviewDate(item?.admissionDate)}, #${
        item?.membershipOrRegistrationNumber
      }`,
  },
};

/** @returns {PageSchema} */
const introPage = {
  uiSchema: {
    ...descriptionUI(ProfessionalAffiliationsIntro),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

/** @returns {PageSchema} */
const jurisdictionPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Jurisdiction',
      description:
        'List each jurisdiction to which you are admitted. You will be able to add additional jurisdictions on the next screen.',
      nounSingular: arrayBuilderOptions.nounSingular,
    }),
    jurisdiction: selectUI('Jurisdiction'),
    otherJurisdiction: textUI({
      title: 'Name of jurisdiction',
      expandUnder: 'jurisdiction',
      expandUnderCondition: 'Other',
      required: (formData, index) =>
        formData?.jurisdictions?.[index]?.jurisdiction === 'Other',
    }),
    admissionDate: currentOrPastDateUI('Date of admission'),
    membershipOrRegistrationNumber: textUI('Membership or registration number'),
  },
  schema: {
    type: 'object',
    properties: {
      jurisdiction: selectSchema(jurisdictionOptions),
      otherJurisdiction: textSchema,
      admissionDate: currentOrPastDateSchema,
      membershipOrRegistrationNumber: textSchema,
    },
    required: [
      'jurisdiction',
      'admissionDate',
      'membershipOrRegistrationNumber',
    ],
  },
};

/**
 * This page is skipped on the first loop for required flow
 * Cards are populated on this page above the uiSchema if items are present
 *
 * @returns {PageSchema}
 */
const summaryPage = {
  uiSchema: {
    'view:hasJurisdictions': arrayBuilderYesNoUI(
      arrayBuilderOptions,
      {},
      {
        labelHeaderLevel: 'p',
        hint: 'List each jurisdiction to which you are admitted.',
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasJurisdictions': arrayBuilderYesNoSchema,
    },
    required: ['view:hasJurisdictions'],
  },
};

const jurisdictionsPages = arrayBuilderPages(
  arrayBuilderOptions,
  pageBuilder => ({
    jurisdictions: pageBuilder.introPage({
      title: 'Professional affiliations',
      path: 'professional-affiliations',
      depends: formData => dependsOn(formData),
      uiSchema: introPage.uiSchema,
      schema: introPage.schema,
    }),
    jurisdictionsSummary: pageBuilder.summaryPage({
      title: 'Review your jurisdictions',
      path: 'jurisdictions-summary',
      depends: formData => dependsOn(formData),
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    jurisdictionPage: pageBuilder.itemPage({
      title: 'Jurisdiction',
      path: 'jurisdictions/:index/jurisdiction',
      depends: formData => dependsOn(formData),
      uiSchema: jurisdictionPage.uiSchema,
      schema: jurisdictionPage.schema,
    }),
  }),
);

export default jurisdictionsPages;
