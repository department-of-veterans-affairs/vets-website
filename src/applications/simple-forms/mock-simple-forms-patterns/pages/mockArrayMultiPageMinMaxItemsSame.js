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
  arrayPath: 'employers-min-max-same',
  nounSingular: 'employer (min max same)',
  nounPlural: 'employers (min max same)',
  required: false,
  isItemIncomplete: item => !item?.name,
  minItems: 2,
  maxItems: 2,
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
    'view:hasEmployersMinMaxItemsSame': arrayBuilderYesNoUI(options, {
      title: 'Do you have any employment?',
    }),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasEmployersMinMaxItemsSame': arrayBuilderYesNoSchema,
    },
    required: ['view:hasEmployersMinMaxItemsSame'],
  },
};

/** @returns {PageSchema} */
const namePage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Employers Min Max Same - Name',
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

const employersMinMaxItemsSamePages = arrayBuilderPages(
  options,
  pageBuilder => ({
    employersMinMaxItemsSameSummary: pageBuilder.summaryPage({
      title: 'Employers Min Max Same',
      path: 'employers-min-max-same',
      uiSchema: summaryPage.uiSchema,
      schema: summaryPage.schema,
      depends: formData =>
        formData?.chapterSelect.arrayMultiPageVariations &&
        formData?.arrayMultiPageVariationsSelect.minMaxSame,
    }),
    employerMinMaxItemsSameNamePage: pageBuilder.itemPage({
      title: 'Employers Min Max Same - Name',
      path: 'employers-min-max-same/:index/name',
      uiSchema: namePage.uiSchema,
      schema: namePage.schema,
      depends: formData =>
        formData?.chapterSelect.arrayMultiPageVariations &&
        formData?.arrayMultiPageVariationsSelect.minMaxSame,
    }),
  }),
);

export default employersMinMaxItemsSamePages;
