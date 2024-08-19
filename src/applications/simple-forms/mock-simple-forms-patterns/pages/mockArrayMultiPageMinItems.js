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
  arrayPath: 'employers-min',
  nounSingular: 'employer (min)',
  nounPlural: 'employers (min)',
  required: false,
  isItemIncomplete: item => !item?.name,
  minItems: 2,
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
    'view:hasEmployersMinItems': arrayBuilderYesNoUI(options, {
      title: 'Do you have any employment?',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasEmployersMinItems': arrayBuilderYesNoSchema,
    },
    required: ['view:hasEmployersMinItems'],
  },
};

/** @returns {PageSchema} */
const namePage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Employers Min Items - Name',
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

const employersMinItemsPages = arrayBuilderPages(options, pageBuilder => ({
  employersMinItemsSummary: pageBuilder.summaryPage({
    title: 'Employers Min Items',
    path: 'employers-min',
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
  }),
  employerMinItemsNamePage: pageBuilder.itemPage({
    title: 'Employers Min Items - Name',
    path: 'employers-min/:index/name',
    uiSchema: namePage.uiSchema,
    schema: namePage.schema,
  }),
}));

export default employersMinItemsPages;
