import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderYesNoUI,
  arrayBuilderYesNoSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import { transformDate } from './helpers';

/** @type {ArrayBuilderOptions} */
export const options = {
  arrayPath: 'treatments',
  nounSingular: 'VA medical center',
  nounPlural: 'VA medical centers',
  required: false,
  maxItems: 3,
  text: {
    summaryTitle: 'Review VA medical centers',
    alertMaxItems:
      'You have added the maximum number of allowed VA medical centers for this application. You may edit or delete a VA medical center or choose to continue on in the application.',
    getItemName: formData =>
      formData.vaMedicalCenterName || 'VA medical center',
    cardDescription: formData =>
      formData?.startDate && formData?.endDate
        ? `${transformDate(formData.startDate)} - ${transformDate(
            formData.endDate,
          )}`
        : 'Treatment dates not provided',
  },
};

/** @returns {PageSchema} */
const introPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Treatment at VA medical centers',
    }),
    'ui:description':
      'Next we’ll ask you about VA medical centers where the Veteran received treatment pertaining to your claim. You may add up to 3 VA medical centers.',
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
      {
        title: 'Did the Veteran receive treatment at a VA medical center?',
        hint: '',
      },
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

/** @returns {PageSchema} */
const nameLocationPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'VA medical center name and location',
      nounSingular: options.nounSingular,
      nounPlural: options.nounPlural,
    }),
    vaMedicalCenterName: textUI('VA medical center name'),
    city: textUI('City'),
    state: textUI('State, province, or region'),
  },
  schema: {
    type: 'object',
    properties: {
      vaMedicalCenterName: textSchema,
      city: textSchema,
      state: textSchema,
    },
    required: ['vaMedicalCenterName', 'city', 'state'],
  },
};

/** @returns {PageSchema} */
const treatmentDatePage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Dates of treatment',
    }),
    startDate: currentOrPastDateUI({
      title: 'Start date of treatment',
      monthSelect: false,
    }),
    endDate: currentOrPastDateUI({
      title: 'End date of treatment',
      monthSelect: false,
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
};

export const treatmentPages = arrayBuilderPages(options, pageBuilder => ({
  dicBenefitsIntro: pageBuilder.introPage({
    title: 'Treatment at VA medical centers',
    path: 'claim-information/dic/treatment',
    depends: formData => formData?.claims?.DIC === true,
    uiSchema: introPage.uiSchema,
    schema: introPage.schema,
  }),
  dicBenefitsSummary: pageBuilder.summaryPage({
    title: 'DIC benefits',
    path: 'claim-information/dic/add',
    depends: formData => formData?.claims?.DIC === true,
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  dicNameLocationPage: pageBuilder.itemPage({
    title: 'VA medical center name and location',
    path: 'claim-information/dic/:index/name-location',
    depends: formData => formData?.claims?.DIC === true,
    uiSchema: nameLocationPage.uiSchema,
    schema: nameLocationPage.schema,
  }),
  dicTreatmentDates: pageBuilder.itemPage({
    title: 'Dates of treatment',
    path: 'claim-information/dic/:index/dates',
    depends: formData => formData?.claims?.DIC === true,
    uiSchema: treatmentDatePage.uiSchema,
    schema: treatmentDatePage.schema,
  }),
}));
