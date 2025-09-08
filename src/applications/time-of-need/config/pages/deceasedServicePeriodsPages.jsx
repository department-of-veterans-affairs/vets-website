// import React from 'react';
import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import {
  arrayBuilderYesNoUI,
  arrayBuilderYesNoSchema,
  arrayBuilderItemFirstPageTitleUI,
  titleUI,
  textSchema,
  selectUI,
  currentOrPastDateUI,
  currentOrPastDateSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import AutosuggestField from '../../components/AutosuggestField';
import { getRankOptionsForBranch } from '../../utils/ranks';

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

// New: branch of service options for autosuggest
const branchOfServiceOptions = [
  'Army',
  'Army National Guard',
  'Air Force',
  'Air National Guard',
  'Marine Corps',
  'Navy',
  'Coast Guard',
  'Space Force',
  'U.S. Public Health Service',
  'National Oceanic and Atmospheric Administration (NOAA) Corps',
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
  maxItems: 3,
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

// Build base select UI once so we can merge its ui:options
const highestRankBaseUI = selectUI({
  title: 'Highest rank attained',
  options: [{ value: '', label: 'Select rank' }],
});

const itemPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Service period',
      nounSingular: options.nounSingular,
    }),
    branchOfService: {
      'ui:title': 'Branch of service',
      'ui:required': () => true,
      'ui:errorMessages': { required: 'Branch of service is required' },
      'ui:field': AutosuggestField,
      'ui:options': {
        idPrefix: 'branch-of-service',
        getOptions: (input = '') =>
          branchOfServiceOptions
            .filter(o => o.toLowerCase().includes(input.trim().toLowerCase()))
            .map(label => ({ id: label, label, value: label })),
        getSuggestions: (input = '') =>
          branchOfServiceOptions
            .filter(o => o.toLowerCase().includes(input.trim().toLowerCase()))
            .map(label => ({ id: label, label, value: label })),
        showAllOnEmptySearch: true,
        minSearchTermLength: 0,
      },
    },
    highestRank: {
      ...highestRankBaseUI,
      'ui:options': {
        ...highestRankBaseUI['ui:options'],
        // Re-run when branchOfService changes in this array item
        dependencies: ['branchOfService'],
        updateSchema: (rootFormData, schema, uiSchema, index) => {
          // rootFormData is the full form data object
          const branch =
            rootFormData?.branchOfService ?? // (in case structure changes)
            (Array.isArray(rootFormData?.servicePeriods)
              ? rootFormData.servicePeriods[index]?.branchOfService
              : undefined);

          const opts = getRankOptionsForBranch(branch);
          // Always provide at least the placeholder
          const enumValues = opts.map(o => o.value);
          const enumNames = opts.map(o => o.label);

          return {
            ...schema,
            enum: enumValues.length ? enumValues : [''],
            enumNames: enumNames.length ? enumNames : ['Select rank'],
          };
        },
        updateData: (rootFormData, currentValue, uiSchema, index) => {
          const branch =
            rootFormData?.branchOfService ??
            (Array.isArray(rootFormData?.servicePeriods)
              ? rootFormData.servicePeriods[index]?.branchOfService
              : undefined);

          const validValues = getRankOptionsForBranch(branch).map(o => o.value);
          return validValues.includes(currentValue) ? currentValue : '';
        },
      },
    },
    dischargeCharacter: selectUI({
      title: 'Discharge character of service',
      options: dischargeOptions,
      'ui:errorMessages': { required: 'Discharge character is required' },
    }),
    serviceStartDate: currentOrPastDateUI({
      title: 'Service start date',
      'ui:options': { required: false },
    }),
    serviceEndDate: currentOrPastDateUI({
      title: 'Service end date',
      'ui:options': { required: false },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      branchOfService: textSchema,
      highestRank: {
        type: 'string',
        enum: [''],
        enumNames: ['Select rank'],
      },
      dischargeCharacter: {
        type: 'string',
        enum: dischargeOptions.map(o => o.value),
        enumNames: dischargeOptions.map(o => o.label),
      },
      serviceStartDate: currentOrPastDateSchema,
      serviceEndDate: currentOrPastDateSchema,
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
