import { arrayBuilderPages } from 'platform/forms-system/src/js/patterns/array-builder';
import {
  arrayBuilderYesNoUI,
  arrayBuilderYesNoSchema,
  arrayBuilderItemFirstPageTitleUI,
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

const residencePeriodsOptions = {
  arrayPath: 'residencePeriods',
  nounSingular: 'residence period',
  nounPlural: 'residence periods',
  required: false,
  maxItems: 10,
  isItemIncomplete: item => !item?.name, // TODO: Update based on required fields
};

export const residencePeriodsPages = arrayBuilderPages(
  residencePeriodsOptions,
  pageBuilder => ({
    residencePeriodsSummary: pageBuilder.summaryPage({
      title: 'Review your residence periods',
      path: 'residencePeriods-summary',
      uiSchema: {
        'view:hasResidence periods': arrayBuilderYesNoUI(
          residencePeriodsOptions,
        ),
      },
      schema: {
        type: 'object',
        properties: {
          'view:hasResidence periods': arrayBuilderYesNoSchema,
        },
      },
    }),
    residencePeriodsName: pageBuilder.itemPage({
      title: 'Residence period name',
      path: 'residencePeriods/:index/name',
      uiSchema: {
        ...arrayBuilderItemFirstPageTitleUI({
          title: 'Residence period name',
          nounSingular: residencePeriodsOptions.nounSingular,
        }),
        name: textUI('Residence period name'),
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
