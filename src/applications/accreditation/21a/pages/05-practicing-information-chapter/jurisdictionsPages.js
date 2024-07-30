import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import {
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currentOrPastDateSchema,
  currentOrPastDateUI,
  descriptionUI,
  selectSchema,
  selectUI,
  textSchema,
  textUI,
  titleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

import PracticingInformationIntro from '../../components/05-practicing-information-chapter/PracticingInformationIntro';
import { jurisdictionOptions } from '../../constants/jurisdictions';
import { formatReviewDate } from '../helpers/formatReviewDate';

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
    ...descriptionUI(PracticingInformationIntro),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

/** @returns {PageSchema} */
const jurisdictionPage = {
  uiSchema: {
    ...titleUI(
      'Jurisdiction',
      'List each jurisdiction to which you are admitted. You will be able to add additional jurisdictions on the next screen.',
    ),
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
      title: 'Practicing information',
      path: 'practicing-information',
      uiSchema: introPage.uiSchema,
      schema: introPage.schema,
    }),
    jurisdictionsSummary: pageBuilder.summaryPage({
      title: 'Review your jurisdictions',
      path: 'jurisdictions-summary',
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    jurisdictionPage: pageBuilder.itemPage({
      title: 'Jurisdiction',
      path: 'jurisdictions/:index/jurisdiction',
      uiSchema: jurisdictionPage.uiSchema,
      schema: jurisdictionPage.schema,
    }),
  }),
);

export default jurisdictionsPages;
