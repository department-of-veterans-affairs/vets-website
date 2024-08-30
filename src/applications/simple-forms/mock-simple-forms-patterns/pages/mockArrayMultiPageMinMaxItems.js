import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  textSchema,
  textUI,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';

function includeChapter(page) {
  return formData => formData?.chapterSelect[page];
}

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'employers-min-max',
  nounSingular: 'employer (min max)',
  nounPlural: 'employers (min max)',
  required: false,
  isItemIncomplete: item => !item?.name,
  minItems: 2,
  maxItems: 4,
  text: {
    getItemName: item => item.name,
  },
};

/**
 * Cards are populated on this page above the uiSchema if items are present
 *
 * @returns {PageSchema}
 */
const summaryPage = {
  uiSchema: {
    'view:hasEmployersMinMaxItems': arrayBuilderYesNoUI(options, {
      title: 'Do you have any employment?',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasEmployersMinMaxItems': arrayBuilderYesNoSchema,
    },
    required: ['view:hasEmployersMinMaxItems'],
  },
};

/** @returns {PageSchema} */
const namePage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Employers Min Max - Name',
      nounSingular: options.nounSingular,
    }),
    name: textUI('Name of employer'),
  },
  schema: {
    type: 'object',
    properties: {
      name: textSchema,
    },
    required: ['name'],
  },
};

const employersMinMaxItemsPages = arrayBuilderPages(options, pageBuilder => ({
  employersMinMaxItemsSummary: pageBuilder.summaryPage({
    title: 'Employers Min Max Items',
    path: 'employers-min-max',
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
    depends: includeChapter('arrayMultiPageBuilderVariations'),
  }),
  employerMinMaxItemsNamePage: pageBuilder.itemPage({
    title: 'Employers Min Max Items - Name',
    path: 'employers-min-max/:index/name',
    uiSchema: namePage.uiSchema,
    schema: namePage.schema,
    depends: includeChapter('arrayMultiPageBuilderVariations'),
  }),
}));

export default employersMinMaxItemsPages;
