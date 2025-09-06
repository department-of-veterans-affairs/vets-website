// import React from 'react';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import {
  arrayBuilderYesNoUI,
  arrayBuilderYesNoSchema,
  arrayBuilderItemFirstPageTitleUI,
  titleUI,
  textSchema,
  textUI,
  selectUI,
  currentOrPastDateDigitsUI,
  currentOrPastDateDigitsSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const rankOptions = [
  { value: '', label: 'Select rank' },
  { value: 'private', label: 'Private' },
  { value: 'sergeant', label: 'Sergeant' },
  { value: 'lieutenant', label: 'Lieutenant' },
  { value: 'captain', label: 'Captain' },
  { value: 'major', label: 'Major' },
  { value: 'colonel', label: 'Colonel' },
  { value: 'general', label: 'General' },
  { value: 'other', label: 'Other' },
];

const dischargeOptions = [
  { value: '', label: 'Select character' },
  { value: 'honorable', label: 'Honorable' },
  { value: 'general', label: 'General (Under Honorable Conditions)' },
  { value: 'otherThanHonorable', label: 'Other Than Honorable' },
  { value: 'badConduct', label: 'Bad Conduct' },
  { value: 'dishonorable', label: 'Dishonorable' },
  { value: 'entryLevelSeparation', label: 'Entry Level Separation' },
  { value: 'uncharacterized', label: 'Uncharacterized' },
  { value: 'unknown', label: 'Unknown' },
];

function getItemName(item) {
  if (!item) return null;
  const branch = item.branchOfService;
  const start = item.serviceStartDate;
  const end = item.serviceEndDate;
  if (branch && start && end) {
    return `${branch} (${start} – ${end})`;
  }
  if (branch) return branch;
  return null;
}

const options = {
  arrayPath: 'servicePeriods',
  nounSingular: 'service period',
  nounPlural: 'service periods',
  required: true,
  maxItems: 10,
  isItemIncomplete: item => !item?.branchOfService || !item?.dischargeCharacter,
  text: {
    getItemName,
    alertMaxItems:
      'You have added the maximum number of service periods. You can edit or delete an existing one or continue.',
    cancelAddTitle: ({ getItemName: g, itemData }) =>
      g(itemData)
        ? `Cancel adding ${g(itemData)}?`
        : 'Cancel adding this service period?',
    cancelAddNo: () => 'No, keep this',
    deleteTitle: ({ getItemName: g, itemData }) =>
      g(itemData)
        ? `Are you sure you want to remove ${g(itemData)}?`
        : 'Are you sure you want to remove this service period?',
    deleteDescription: ({ getItemName: g, itemData }) =>
      g(itemData)
        ? `This will remove ${g(itemData)} and all related information.`
        : 'This will remove this service period and all related information.',
    deleteNeedAtLeastOneDescription: ({ getItemName: g, itemData }) =>
      g(itemData)
        ? `If you remove ${g(
            itemData,
          )}, you must add at least one service period for us to process this form.`
        : 'If you remove this, you must add at least one service period for us to process this form.',
    deleteYes: () => 'Yes, remove this',
    deleteNo: () => 'No, keep this',
    cancelEditTitle: ({ getItemName: g, itemData }) =>
      g(itemData)
        ? `Cancel editing ${g(itemData)}?`
        : 'Cancel editing this service period?',
    cancelEditDescription: () =>
      'If you cancel, you’ll lose any changes you made on this screen and return to the service periods review page.',
    cancelEditYes: () => 'Yes, cancel',
    cancelEditNo: () => 'No, keep this',
    summaryTitle: formData =>
      (formData?.servicePeriods?.length || 0) > 0
        ? 'Service period(s)'
        : 'Review your service periods',
  },
};

const introPage = {
  uiSchema: {
    ...titleUI(
      'Deceased’s service period(s)',
      'In the next few questions, add each period of the deceased’s military service. You must add at least one period.',
    ),
  },
  schema: { type: 'object', properties: {} },
};

const summaryPage = {
  uiSchema: {
    'view:hasServicePeriods': arrayBuilderYesNoUI(options, {
      title: 'Do you want to add a military service period?',
      labels: { Y: 'Yes', N: 'No' },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasServicePeriods': arrayBuilderYesNoSchema,
    },
    required: ['view:hasServicePeriods'],
  },
};

const itemPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Service period',
      nounSingular: options.nounSingular,
    }),
    branchOfService: textUI({
      title: 'Branch of service',
      'ui:required': true,
      'ui:errorMessages': { required: 'Branch of service is required' },
    }),
    highestRank: selectUI({
      title: 'Highest rank attained',
      options: rankOptions,
    }),
    dischargeCharacter: selectUI({
      title: 'Discharge character of service',
      'ui:required': true,
      options: dischargeOptions,
      'ui:errorMessages': { required: 'Discharge character is required' },
    }),
    serviceStartDate: currentOrPastDateDigitsUI({
      title: 'Service start date',
      'ui:options': {
        hint:
          'Enter two digits for month and day and four digits for year (MMDDYYYY).',
      },
    }),
    serviceEndDate: currentOrPastDateDigitsUI({
      title: 'Service end date',
      'ui:options': {
        hint:
          'Enter two digits for month and day and four digits for year (MMDDYYYY).',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      branchOfService: textSchema,
      highestRank: {
        type: 'string',
        enum: rankOptions.map(o => o.value),
        enumNames: rankOptions.map(o => o.label),
      },
      dischargeCharacter: {
        type: 'string',
        enum: dischargeOptions.map(o => o.value),
        enumNames: dischargeOptions.map(o => o.label),
      },
      serviceStartDate: currentOrPastDateDigitsSchema,
      serviceEndDate: currentOrPastDateDigitsSchema,
    },
    required: ['branchOfService', 'dischargeCharacter'],
  },
};

export const deceasedServicePeriodsPages = arrayBuilderPages(
  options,
  pageBuilder => ({
    servicePeriodsIntro: pageBuilder.introPage({
      title: 'Service periods',
      path: 'service-periods-intro',
      uiSchema: introPage.uiSchema,
      schema: introPage.schema,
    }),
    servicePeriodsSummary: pageBuilder.summaryPage({
      title: 'Review service periods',
      path: 'service-periods-summary',
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
    }),
    servicePeriodItem: pageBuilder.itemPage({
      title: 'Service period',
      path: 'service-periods/:index/period',
      uiSchema: itemPage.uiSchema,
      schema: itemPage.schema,
    }),
  }),
);
