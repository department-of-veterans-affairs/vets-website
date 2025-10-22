import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderYesNoUI,
  arrayBuilderYesNoSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';

// Short description shown on the intro page.
const treatmentDescription =
  'In the next few questions, we’ll ask you about VA medical centers where the Veteran received treatment pertaining to your claim.';

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'vaMedicalCenters',
  nounSingular: 'VA medical center',
  nounPlural: 'VA medical centers',
  required: false,
  text: {
    getItemName: 'VA medical center',
    cardDescription: '',
  },
};

/** @returns {PageSchema} */
const introPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Treatment at VA medical centers',
      nounSingular: options.nounSingular,
      nounPlural: options.nounPlural,
    }),
    'ui:description': treatmentDescription,
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

/** @returns {PageSchema} */
const summaryPage = {
  uiSchema: {
    'view:isAddingDicBenefits': arrayBuilderYesNoUI(
      options,
      { hint: '' },
      { hint: '' },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:isAddingDicBenefits': arrayBuilderYesNoSchema,
    },
    required: ['view:isAddingDicBenefits'],
  },
};

const nameLocationUiSchema = {
  ...arrayBuilderItemFirstPageTitleUI({
    title: 'VA medical center name and location',
    nounSingular: options.nounSingular,
    nounPlural: options.nounPlural,
  }),
  vaMedicalCenterName: {
    'ui:title': 'VA medical center name',
  },
  city: {
    'ui:title': 'City',
  },
  state: {
    'ui:title': 'State, province, or region',
  },
};

const nameLocationSchema = {
  type: 'object',
  properties: {
    vaMedicalCenterName: { type: 'string' },
    city: { type: 'string' },
    state: { type: 'string' },
  },
  required: ['vaMedicalCenterName', 'city', 'state'],
};

export const treatmentPages = arrayBuilderPages(options, pageBuilder => ({
  dicBenefitsIntro: pageBuilder.introPage({
    title: 'Treatment at VA medical center',
    path: 'claim-information/dic/treatment',
    uiSchema: introPage.uiSchema,
    schema: introPage.schema,
  }),
  dicBenefitsSummary: pageBuilder.summaryPage({
    title: 'D.I.C. benefits',
    path: 'claim-information/dic/add',
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  dicNameLocationPage: pageBuilder.itemPage({
    title: 'VA medical center name and location',
    path: 'claim-information/dic/:index/name-location',
    uiSchema: nameLocationUiSchema,
    schema: nameLocationSchema,
  }),
  dicTreatmentDates: pageBuilder.itemPage({
    title: 'Dates of treatment',
    path: 'claim-information/dic/:index/dates',
    uiSchema: {
      ...arrayBuilderItemFirstPageTitleUI({
        title: 'Dates of treatment',
        nounSingular: options.nounSingular,
        nounPlural: options.nounPlural,
      }),
      startDate: currentOrPastDateUI({
        title: 'Start date of treatment',
        monthSelect: false,
        'ui:description':
          'Enter 2 digits for the month and day and 4 digits for the year.',
        required: formData =>
          formData?.firstTimeReporting !== undefined &&
          formData?.firstTimeReporting === false,
      }),
      endDate: currentOrPastDateUI({
        title: 'End date of treatment',
        monthSelect: false,
        required: formData =>
          formData?.firstTimeReporting !== undefined &&
          formData?.firstTimeReporting === false,
      }),
    },
    schema: {
      type: 'object',
      properties: {
        startDate: currentOrPastDateSchema,
        endDate: currentOrPastDateSchema,
      },
      required: ['startDate', 'endDate'],
    },
  }),
}));
