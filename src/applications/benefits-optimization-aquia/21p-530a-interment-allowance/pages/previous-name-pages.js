import { capitalize } from 'lodash';
import {
  arrayBuilderItemFirstPageTitleUI,
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';

// Format the name for display
const formatName = name => {
  const parts = [
    capitalize(name.first),
    capitalize(name.middle),
    capitalize(name.last),
  ].filter(Boolean);
  return parts.join(' ');
};

/**
 * Configuration for the Veteran's previous names
 */
/** @type {ArrayBuilderOptions} */
const previousNameOptions = {
  arrayPath: 'previousNames',
  nounSingular: 'previous name',
  nounPlural: 'previous names',
  required: false,
  isItemIncomplete: item =>
    !item.previousName?.first && !item.previousName?.last,
  text: {
    summaryTitle: 'Review the names the Veteran served under',
    getItemName: item => `${formatName(item?.previousName)}`,
  },
};

// Service Locations and rank
const previousNamePage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Name the Veteran served under',
      nounSingular: previousNameOptions.nounSingular,
    }),
    previousName: {
      ...fullNameNoSuffixUI(),
      first: {
        ...fullNameNoSuffixUI().first,
        'ui:title': 'First or given name',
      },
      middle: {
        ...fullNameNoSuffixUI().middle,
        'ui:title': 'Middle name',
      },
      last: {
        ...fullNameNoSuffixUI().last,
        'ui:title': 'Last or family name',
      },
    },
    servicePeriod: {
      ...titleUI(
        'Service periods',
        'Please list which service periods the Veteran served under this name (ex. Navy).',
      ),
      'ui:widget': 'textarea',
      'ui:options': {
        rows: 2,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      previousName: fullNameNoSuffixSchema,
      servicePeriod: {
        type: 'string',
      },
    },
  },
};

// Previous name Summary Page
const previousNameSummaryPage = {
  uiSchema: {
    'view:completedPreviousNames': arrayBuilderYesNoUI(
      previousNameOptions,
      {
        title: 'Did the Veteran serve under another name?',
        hint:
          'If you answer yes, you’ll need to add at least one previous name on the next screen.',
        labels: {
          Y: 'Yes',
          N: 'No',
        },
      },
      {
        title: 'Do you have another name the Veteran served under?',
        labels: {
          Y: 'Yes',
          N: 'No',
        },
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:completedPreviousNames': arrayBuilderYesNoSchema,
    },
    required: ['view:completedPreviousNames'],
  },
};

export const previousNamePages = arrayBuilderPages(
  previousNameOptions,
  pageBuilder => ({
    previousNamesSummary: pageBuilder.summaryPage({
      path: 'served-under-previous-names',
      title: 'Review the names the Veteran served under',
      uiSchema: previousNameSummaryPage.uiSchema,
      schema: previousNameSummaryPage.schema,
    }),
    previousName: pageBuilder.itemPage({
      path: 'served-under-previous-names/:index/previous-name',
      title: 'Name the Veteran served under',
      uiSchema: previousNamePage.uiSchema,
      schema: previousNamePage.schema,
    }),
  }),
);
