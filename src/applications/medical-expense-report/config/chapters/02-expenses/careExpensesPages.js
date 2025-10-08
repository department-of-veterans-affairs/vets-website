import React from 'react';
import PropTypes from 'prop-types';
import {
  // currencyUI,
  // currencySchema,
  // radioUI,
  // checkboxUI,
  // radioSchema,
  titleUI,
  // numberSchema,
  // checkboxSchema,
  // numberUI,
  textUI,
  textSchema,
  arrayBuilderItemFirstPageTitleUI,
  // arrayBuilderItemSubsequentPageTitleUI,
  // currentOrPastDateRangeUI,
  // currentOrPastDateRangeSchema,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
// import { formatReviewDate } from 'platform/forms-system/src/js/helpers';

import ListItemView from '../../../components/ListItemView';
// import { recipientTypeLabels } from '../../../utils/labels';

const CareExpenseView = ({ formData }) => (
  <ListItemView title={formData.provider} />
);

CareExpenseView.propTypes = {
  formData: PropTypes.shape({
    provider: PropTypes.string,
  }),
};

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'careExpenses',
  nounSingular: 'treatment record',
  nounPlural: 'treatment records',
  required: false,
  isItemIncomplete: item => !item?.name,
  maxItems: 5,
  text: {
    getItemName: item => item?.name,
    // cardDescription: item => `blah`,
  },
};

/** @returns {PageSchema} */
const introPage = {
  uiSchema: {
    ...titleUI(
      `Treatment records`,
      `In the next few questions, we’ll ask you about the treatment records you’re requesting. You must add at least one treatment request. You may add up to ${
        options.maxItems
      }.`,
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};

/**
 * This page is skipped on the first loop for required flow
 * Cards are populated on this page above the uiSchema if items are present
 *
 * @returns {PageSchema}
 */
const summaryPage = {
  uiSchema: {
    'view:hasCareExpenses': arrayBuilderYesNoUI(options),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasCareExpenses': arrayBuilderYesNoSchema,
    },
    required: ['view:hasCareExpenses'],
  },
};

/** @returns {PageSchema} */
const namePage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Name',
      nounSingular: options.nounSingular,
    }),
    name: textUI('Name'),
  },
  schema: {
    type: 'object',
    properties: {
      name: textSchema,
    },
    required: ['name'],
  },
};

export const careExpensesPages = arrayBuilderPages(options, pageBuilder => ({
  intro: pageBuilder.introPage({
    title: 'Care expenses',
    path: 'expenses/care',
    uiSchema: introPage.uiSchema,
    schema: introPage.schema,
  }),
  careExpensesSummary: pageBuilder.summaryPage({
    title: 'Care expenses',
    path: 'expenses/care-summary',
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
    ContentBeforeButtons: () => (
      <div>
        <p>
          Content before "Finish your form later" link, and back/continue
          buttons
        </p>
      </div>
    ),
  }),
  careExpensesNamePage: pageBuilder.itemPage({
    title: 'Add unreimbursed care expense',
    path: 'expenses/care/:index/name',
    uiSchema: namePage.uiSchema,
    schema: namePage.schema,
  }),
}));

// export default {
//   title: 'In-home and facility care',
//   path: 'expenses/care/add',
//   depends: formData => formData.hasCareExpenses === true,
//   uiSchema: {
//     ...titleUI('Add unreimbursed care expenses'),
//     careExpenses: {
//       'ui:options': {
//         itemName: 'In-home or Facility Care Expense',
//         itemAriaLabel: data =>
//           `${data.provider} in-home or cacility care expense`,
//         viewField: CareExpenseView,
//         reviewTitle: 'Care Expenses',
//         keepInPageOnReview: true,
//         customTitle: ' ',
//         confirmRemove: true,
//         useDlWrap: true,
//         useVaCards: true,
//         showSave: true,
//         reviewMode: true,
//       },
//       items: {
//         recipients: radioUI({
//           title: 'Who is the expense for?',
//           labels: recipientTypeLabels,
//         }),
//         childName: textUI({
//           title: 'Enter the child’s name',
//           expandUnder: 'recipients',
//           expandUnderCondition: field =>
//             field === 'DEPENDENT' || field === 'OTHER',
//           hideIf: (formData, index) =>
//             !['DEPENDENT', 'OTHER'].includes(
//               formData?.careExpenses?.[index]?.recipients,
//             ),
//           required: (formData, index) =>
//             ['DEPENDENT', 'OTHER'].includes(
//               formData?.careExpenses?.[index]?.recipients,
//             ),
//         }),
//         provider: textUI('What’s the name of the care provider?'),
//         careDate: currentOrPastDateRangeUI(
//           {
//             title: 'Care start date',
//             monthSelect: false,
//           },
//           {
//             title: 'Care end date',
//             monthSelect: false,
//           },
//         ),
//         noEndDate: checkboxUI('No end date'),
//         monthlyPayment: currencyUI('How much is each monthly payment?'),
//         typeOfCare: radioUI({
//           title: 'Select the type of care.',
//           labels: {
//             residential: 'Residential care facility',
//             inHome: 'In-home care attendant',
//           },
//         }),
//         hourlyRate: currencyUI('What is the provider’s rate per hour?'),
//         hoursPerWeek: numberUI(
//           'How many hours per week does the care provider work?',
//         ),
//       },
//     },
//   },
//   schema: {
//     type: 'object',
//     properties: {
//       careExpenses: {
//         type: 'array',
//         minItems: 1,
//         items: {
//           type: 'object',
//           required: [
//             'recipients',
//             'provider',
//             'careDate',
//             'monthlyPayment',
//             'typeOfCare',
//             'hourlyRate',
//             'hoursPerWeek',
//           ],
//           properties: {
//             recipients: radioSchema(Object.keys(recipientTypeLabels)),
//             childName: textSchema,
//             provider: textSchema,
//             careDate: {
//               ...currentOrPastDateRangeSchema,
//               required: ['from'],
//             },
//             noEndDate: checkboxSchema,
//             monthlyPayment: currencySchema,
//             typeOfCare: radioSchema(['residential', 'inHome']),
//             hourlyRate: currencySchema,
//             hoursPerWeek: numberSchema,
//           },
//         },
//       },
//     },
//   },
// };
