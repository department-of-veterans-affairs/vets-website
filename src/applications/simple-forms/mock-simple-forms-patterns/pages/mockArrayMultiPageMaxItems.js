import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  textSchema,
  textUI,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'employers-max',
  nounSingular: 'employer',
  nounPlural: 'employers',
  required: false,
  isItemIncomplete: item => !item?.name,
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
    'view:hasEmployersMaxItems': arrayBuilderYesNoUI(options, {
      title: 'Do you have any employment?',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasEmployersMaxItems': arrayBuilderYesNoSchema,
    },
    required: ['view:hasEmployersMaxItems'],
  },
};

/** @returns {PageSchema} */
const namePage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Employers Max Items - Name',
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

const employersMaxItemsPages = arrayBuilderPages(options, pageBuilder => ({
  employersSummary: pageBuilder.summaryPage({
    title: 'Employers Max Items',
    path: 'employers-max',
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  employerNamePage: pageBuilder.itemPage({
    title: 'Employers Max Items - Name',
    path: 'employers-max/:index/name',
    uiSchema: namePage.uiSchema,
    schema: namePage.schema,
  }),
}));

export default employersMaxItemsPages;
