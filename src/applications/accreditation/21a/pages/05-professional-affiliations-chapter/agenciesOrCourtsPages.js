import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currentOrPastDateSchema,
  currentOrPastDateUI,
  selectSchema,
  selectUI,
  textSchema,
  textUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

import { agenciesOrCourtsOptions } from '../../constants/agenciesOrCourts';
import { formatReviewDate } from '../helpers/formatReviewDate';

import content from '../../locales/en/content.json';

/** @type {ArrayBuilderOptions} */
export const arrayBuilderOptions = {
  arrayPath: 'agenciesOrCourts',
  nounSingular: 'state or Federal agency or court',
  nounPlural: 'state or Federal agencies or courts',
  required: false,
  isItemIncomplete: item =>
    !item?.agencyOrCourt ||
    (item?.agencyOrCourt === 'Other' && !item?.otherAgencyOrCourt) ||
    !item?.admissionDate ||
    !item?.membershipOrRegistrationNumber,
  text: {
    yesNoBlankReviewQuestion: () => content['agency-or-court-question'],
    reviewAddButtonText: () => content['agency-or-court-add-button-text'],
    getItemName: item =>
      item?.agencyOrCourt === 'Other'
        ? item?.otherAgencyOrCourt
        : item?.agencyOrCourt,
    cardDescription: item =>
      `${formatReviewDate(item?.admissionDate)}, #${
        item?.membershipOrRegistrationNumber
      }`,
  },
};

/** @returns {PageSchema} */
const agencyOrCourtPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'State or Federal agency or court',
      description:
        'List each agency or court to which you are admitted. You will be able to add additional agencies or courts on the next screen.',
      nounSingular: arrayBuilderOptions.nounSingular,
    }),
    agencyOrCourt: selectUI('Agency/court'),
    otherAgencyOrCourt: textUI({
      title: 'Name of agency/court',
      expandUnder: 'agencyOrCourt',
      expandUnderCondition: 'Other',
      required: (formData, index) =>
        formData?.agenciesOrCourts?.[index]?.agencyOrCourt === 'Other',
    }),
    admissionDate: currentOrPastDateUI('Date of admission'),
    membershipOrRegistrationNumber: textUI('Membership or registration number'),
  },
  schema: {
    type: 'object',
    properties: {
      agencyOrCourt: selectSchema(agenciesOrCourtsOptions),
      otherAgencyOrCourt: textSchema,
      admissionDate: currentOrPastDateSchema,
      membershipOrRegistrationNumber: textSchema,
    },
    required: [
      'agencyOrCourt',
      'admissionDate',
      'membershipOrRegistrationNumber',
    ],
  },
};

/**
 * Cards are populated on this page above the uiSchema if items are present
 *
 * @returns {PageSchema}
 */
const summaryPage = {
  uiSchema: {
    'view:hasAgenciesOrCourts': arrayBuilderYesNoUI(
      arrayBuilderOptions,
      {
        title:
          'Are you currently admitted to practice before any state or Federal agency or any Federal court?',
        labelHeaderLevel: 'p',
        hint: ' ',
      },
      {
        labelHeaderLevel: 'p',
        hint: 'List each agency or court to which you are admitted.',
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasAgenciesOrCourts': arrayBuilderYesNoSchema,
    },
    required: ['view:hasAgenciesOrCourts'],
  },
};

const agenciesOrCourtsPages = arrayBuilderPages(
  arrayBuilderOptions,
  pageBuilder => ({
    agenciesOrCourtsSummary: pageBuilder.summaryPage({
      title: 'Review your state or Federal agencies or courts',
      path: 'agencies-courts-summary',
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    agencyOrCourtPage: pageBuilder.itemPage({
      title: 'State or Federal agency or court',
      path: 'agencies-courts/:index/agency-court',
      uiSchema: agencyOrCourtPage.uiSchema,
      schema: agencyOrCourtPage.schema,
    }),
  }),
);

export default agenciesOrCourtsPages;
