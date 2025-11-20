import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import {
  arrayBuilderYesNoUI,
  arrayBuilderYesNoSchema,
  arrayBuilderItemFirstPageTitleUI,
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const spousePreviousMarriagesOptions = {
  arrayPath: 'spousePreviousMarriages',
  nounSingular: 'previous marriage',
  nounPlural: 'previous marriages',
  required: false,
  maxItems: 3,
  isItemIncomplete: item => !item?.name, // TODO: Update based on required fields
};

export const spousePreviousMarriagesPages = arrayBuilderPages(
  spousePreviousMarriagesOptions,
  pageBuilder => ({
    spousePreviousMarriagesSummary: pageBuilder.summaryPage({
      title: 'Review your previous marriages',
      path: 'spousePreviousMarriages-summary',
      uiSchema: {
        'view:hasPrevious marriages': arrayBuilderYesNoUI(
          spousePreviousMarriagesOptions,
        ),
      },
      schema: {
        type: 'object',
        properties: {
          'view:hasPrevious marriages': arrayBuilderYesNoSchema,
        },
      },
    }),
    spousePreviousMarriagesName: pageBuilder.itemPage({
      title: 'Previous marriage name',
      path: 'spousePreviousMarriages/:index/name',
      uiSchema: {
        ...arrayBuilderItemFirstPageTitleUI({
          title: 'Previous marriage name',
          nounSingular: spousePreviousMarriagesOptions.nounSingular,
        }),
        name: textUI('Previous marriage name'),
      },
      schema: {
        type: 'object',
        properties: {
          name: textSchema,
        },
        required: ['name'],
      },
    }),
  }),
);
