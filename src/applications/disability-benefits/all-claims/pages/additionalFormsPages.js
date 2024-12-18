import {
  arrayBuilderItemFirstPageTitleUI,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
  textUI,
  textSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
// import * as workflowChoicePage from './form0781/workflowChoicePage'

// TODO: replace with with an actual read from the form
function isFormComplete() {
  return false
}

/** @type {ArrayBuilderOptions} */
const options = {
  useLinkInsteadOfYesNo: true,
  required: false,
  arrayPath: 'additional-forms',
  nounSingular: 'Additional FormWipn',
  nounPlural: 'Additional FormsWipn',
  isItemIncomplete: () => isFormComplete(), // include all required fields here
  maxItems: 1,
  text: {
    getItemName: (item, index) => 'item.name',
    summaryTitle: 'title 1',
    summaryTitleWithoutItems: 'title 2',
    summaryDescription: 'description 1',
    summaryDescriptionWithoutItems: 'description 2',
    summaryAddLinkText: (props) => { 'my link' },
    reviewAddButtonText: (props) => { 'my review button' },
    yesNoBlankReviewQuestion: 'Did you have any events?', // No
    cardDescription: item => { 'card description time' }
  },
};


export const schema = {

/** @returns {PageSchema} */
export const additionalFormsPages = arrayBuilderPages(
  options,
  pageBuilder => ({
    additionalFormsSummary: pageBuilder.summaryPage({
      title: 'Review your Additional Forms',
      path: 'additional-forms/:index',
      uiSchema: {},
      schema: {},
    }),
    workflowChoicePage: pageBuilder.itemPage({
      title: 'Work',
      path: 'additional-forms/:index/wipn',
      uiSchema: {
        'ui:description': 'Placeholder Text for workflow choice page',
      },
      schema:
      {
  type: 'object',
  properties: {},
};
,
    }),
  }),
);
