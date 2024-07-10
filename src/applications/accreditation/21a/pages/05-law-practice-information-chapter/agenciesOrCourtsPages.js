import { formatReviewDate } from '~/platform/forms-system/src/js/helpers';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import {
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currentOrPastDateSchema,
  currentOrPastDateUI,
  textSchema,
  textUI,
  titleUI,
} from '~/platform/forms-system/src/js/web-component-patterns';

/** @type {ArrayBuilderOptions} */
const arrayBuilderOptions = {
  arrayPath: 'agenciesOrCourts',
  nounSingular: 'agency or court',
  nounPlural: 'agencies or courts',
  required: false,
  isItemIncomplete: item =>
    !item?.name ||
    !item?.admissionDate ||
    !item?.membershipOrRegistrationNumber,
  text: {
    getItemName: item => item.name,
    cardDescription: item => formatReviewDate(item?.admissionDate),
  },
};

/** @returns {PageSchema} */
const agencyOrCourtPage = {
  uiSchema: {
    ...titleUI(
      'State or federal agency or court',
      'Add details of an agency or court you are admitted to practice before.',
    ),
    name: textUI('Name of agency/court'),
    admissionDate: currentOrPastDateUI('Date of admission'),
    membershipOrRegistrationNumber: textUI('Membership or registration number'),
  },
  schema: {
    type: 'object',
    properties: {
      name: textSchema,
      admissionDate: currentOrPastDateSchema,
      membershipOrRegistrationNumber: textSchema,
    },
    required: ['name', 'admissionDate', 'membershipOrRegistrationNumber'],
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
          'Are you currently permitted to practice before any state or federal agency or any federal court?',
        labelHeaderLevel: 'p',
        hint: ' ',
      },
      {
        labelHeaderLevel: 'p',
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
      title: 'Review your state or federal agencies or courts',
      path: 'agencies-courts-summary',
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    agencyOrCourtPage: pageBuilder.itemPage({
      title: 'State or federal agency or court',
      path: 'agencies-courts/:index/agency-court',
      uiSchema: agencyOrCourtPage.uiSchema,
      schema: agencyOrCourtPage.schema,
    }),
  }),
);

export default agenciesOrCourtsPages;
