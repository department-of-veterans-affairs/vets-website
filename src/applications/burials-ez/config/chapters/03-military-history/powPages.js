import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  currentOrPastDateRangeUI,
  currentOrPastDateRangeSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { formatDateLong } from 'platform/utilities/date';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
import { showPdfFormAlignment } from '../../../utils/helpers';

/** @type {ArrayBuilderOptions} */
export const options = {
  arrayPath: 'powPeriods',
  nounSingular: 'confinement period',
  nounPlural: 'confinement periods',
  required: false,
  isItemIncomplete: item => !item?.powDateRange?.from || !item.powDateRange?.to, // include all required fields here
  text: {
    getItemName: item =>
      item?.powDateRange?.from && item?.powDateRange?.to
        ? `${formatDateLong(item.powDateRange.from)} - ${formatDateLong(
            item.powDateRange.to,
          )}`
        : undefined,
    summaryTitleWithoutItems: 'Prisoner of war status',
    summaryTitle: 'Review your prisoner of war confinement periods',
    alertItemUpdated: ({ itemData, nounSingular }) => {
      const itemName = options.text.getItemName?.(itemData);
      return itemName
        ? `Your prisoner of war confinement period from ${itemName} has been updated`
        : `Your ${nounSingular} information has been updated`;
    },
    alertItemDeleted: ({ itemData, nounSingular }) => {
      const itemName = options.text.getItemName?.(itemData);
      return itemName
        ? `Your prisoner of war confinement period from ${itemName} has been deleted`
        : `Your ${nounSingular} information has been deleted`;
    },
    cancelAddTitle: 'Cancel adding this confinement period',
    cancelAddYes: 'Yes, cancel adding this confinement period',
    cancelAddNo: 'No',
    cancelEditTitle: 'Cancel editing this confinement period',
    cancelEditYes: 'Yes, cancel editing this confinement period',
    cancelEditNo: 'No',
    cancelNo: 'No',
    deleteTitle: 'Delete this confinement period',
    deleteDescription: ({ itemData, nounSingular, nounPlural }) => {
      const itemName = options.text.getItemName?.(itemData);
      return itemName
        ? `This will delete ${itemName} from your list of ${nounPlural}.`
        : `This will delete this ${nounSingular} from your list of ${nounPlural}`;
    },
  },
};

/**
 * Cards are populated on this page above the uiSchema if items are present
 *
 * @returns {PageSchema}
 */
const summaryPage = {
  uiSchema: {
    'view:isAddingPeriods': arrayBuilderYesNoUI(
      options,
      {
        title: 'Was the Veteran ever a prisoner of war?',
        hint: null,
      },
      {
        title: 'Do you have another prisoner of war confinement period to add?',
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:isAddingPeriods': arrayBuilderYesNoSchema,
    },
    required: ['view:isAddingPeriods'],
  },
};

/** @returns {PageSchema} */
const powDateRangePage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Prisoner of war confinement period',
      nounSingular: options.nounSingular,
      hasMultipleItemPages: false,
    }),
    powDateRange: {
      ...currentOrPastDateRangeUI(
        'Start of confinement',
        'End of confinement',
        'Confinement start date must be before end date',
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      powDateRange: currentOrPastDateRangeSchema,
    },
    required: ['powDateRange'],
  },
};

export const powPages = arrayBuilderPages(options, pageBuilder => ({
  powSummary: pageBuilder.summaryPage({
    title: 'Prisoner of war status',
    path: 'military/pow/summary',
    depends: () => showPdfFormAlignment(),
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  powDateRangePage: pageBuilder.itemPage({
    title: 'Prisoner of war confinement period',
    path: 'military/pow/:index/date-range',
    depends: () => showPdfFormAlignment(),
    uiSchema: powDateRangePage.uiSchema,
    schema: powDateRangePage.schema,
  }),
}));
