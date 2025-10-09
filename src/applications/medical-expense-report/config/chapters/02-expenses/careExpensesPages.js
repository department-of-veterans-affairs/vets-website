import React from 'react';
import PropTypes from 'prop-types';
import {
  currencyUI,
  currencySchema,
  radioUI,
  checkboxUI,
  radioSchema,
  // titleUI,
  // numberSchema,
  checkboxSchema,
  // numberUI,
  textUI,
  textSchema,
  arrayBuilderItemFirstPageTitleUI,
  // arrayBuilderItemSubsequentPageTitleUI,
  currentOrPastDateRangeUI,
  currentOrPastDateRangeSchema,
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
// import { formatReviewDate } from 'platform/forms-system/src/js/helpers';

import ListItemView from '../../../components/ListItemView';
import { recipientTypeLabels } from '../../../utils/labels';

const CareExpenseView = ({ formData }) => (
  <ListItemView title={formData.provider} />
);

CareExpenseView.propTypes = {
  formData: PropTypes.shape({
    provider: PropTypes.string,
  }),
};

const transformTypeOfCare = type =>
  type === 'residential'
    ? 'Residential care facility'
    : 'In-home care attendant';

/** @type {ArrayBuilderOptions} */
const options = {
  arrayPath: 'careExpenses',
  nounSingular: 'care expense',
  nounPlural: 'care expenses',
  required: false,
  isItemIncomplete: item =>
    !item?.typeOfCare ||
    !item?.recipients ||
    !item?.careDate?.from ||
    !item?.monthlyPayment,
  maxItems: 5,
  text: {
    getItemName: item =>
      transformTypeOfCare(item?.typeOfCare) || 'New care expense',
    // cardDescription: item => `blah`,
  },
};

/** @returns {PageSchema} */
// const introPage = {
//   uiSchema: {
//     ...titleUI(
//       `Treatment records`,
//       `In the next few questions, we’ll ask you about the treatment records you’re requesting. You must add at least one treatment request. You may add up to ${
//         options.maxItems
//       }.`,
//     ),
//   },
//   schema: {
//     type: 'object',
//     properties: {},
//   },
// };

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
const typeOfCarePage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Type of care',
      nounSingular: options.nounSingular,
    }),
    typeOfCare: radioUI({
      title: 'Select the type of care.',
      labels: {
        residential: 'Residential care facility',
        inHome: 'In-home care attendant',
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      typeOfCare: radioSchema(['residential', 'inHome']),
    },
    required: ['typeOfCare'],
  },
};

/** @returns {PageSchema} */
const recipientPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Type of care',
      nounSingular: options.nounSingular,
    }),
    recipients: radioUI({
      title: 'Who is the expense for?',
      labels: recipientTypeLabels,
    }),
    childName: textUI({
      title: 'Enter the child’s name',
      expandUnder: 'recipients',
      expandUnderCondition: field => field === 'DEPENDENT' || field === 'OTHER',
      required: (formData, index) =>
        ['DEPENDENT', 'OTHER'].includes(
          formData?.careExpenses?.[index]?.recipients,
        ),
    }),
  },
  schema: {
    type: 'object',
    properties: {
      recipients: radioSchema(Object.keys(recipientTypeLabels)),
      childName: textSchema,
    },
    required: ['recipients'],
  },
};
/** @returns {PageSchema} */
const datePage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Type of care',
      nounSingular: options.nounSingular,
    }),
    careDate: currentOrPastDateRangeUI(
      {
        title: 'Care start date',
        monthSelect: false,
      },
      {
        title: 'Care end date',
        monthSelect: false,
      },
    ),
    noEndDate: checkboxUI('No end date'),
  },
  schema: {
    type: 'object',
    properties: {
      careDate: {
        ...currentOrPastDateRangeSchema,
        required: ['from'],
      },
      noEndDate: checkboxSchema,
    },
    required: ['typeOfCare'],
  },
};

/** @returns {PageSchema} */
const costPage = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Cost of care',
      nounSingular: options.nounSingular,
    }),
    monthlyPayment: currencyUI('How much is each monthly payment?'),
  },
  schema: {
    type: 'object',
    properties: {
      monthlyPayment: currencySchema,
    },
    required: ['monthlyPayment'],
  },
};

export const careExpensesPages = arrayBuilderPages(options, pageBuilder => ({
  // intro: pageBuilder.introPage({
  //   title: 'Care expenses',
  //   path: 'expenses/care',
  //   uiSchema: introPage.uiSchema,
  //   schema: introPage.schema,
  // }),
  careExpensesSummary: pageBuilder.summaryPage({
    title: 'Care expenses',
    path: 'expenses/care-summary',
    uiSchema: summaryPage.uiSchema,
    schema: summaryPage.schema,
    ContentBeforeButtons: () => (
      <div>
        <p>
          Content before "Finish your form la ter" link, and back/continue
          buttons
        </p>
      </div>
    ),
  }),
  careExpensesTypePage: pageBuilder.itemPage({
    title: 'Type of care',
    path: 'expenses/care/:index/type-of-care',
    uiSchema: typeOfCarePage.uiSchema,
    schema: typeOfCarePage.schema,
  }),
  careExpensesRecipientPage: pageBuilder.itemPage({
    title: 'Care recipient and pro',
    path: 'expenses/care/:index/recipient-provider',
    uiSchema: recipientPage.uiSchema,
    schema: recipientPage.schema,
  }),
  careExpensesDatesPage: pageBuilder.itemPage({
    title: 'Dates of care',
    path: 'expenses/care/:index/dates',
    uiSchema: datePage.uiSchema,
    schema: datePage.schema,
  }),
  careExpensesCostPage: pageBuilder.itemPage({
    title: 'Cost of care',
    path: 'expenses/care/:index/cost',
    uiSchema: costPage.uiSchema,
    schema: costPage.schema,
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
// recipients: radioUI({
//   title: 'Who is the expense for?',
//   labels: recipientTypeLabels,
// }),
// childName: textUI({
//   title: 'Enter the child’s name',
//   expandUnder: 'recipients',
//   expandUnderCondition: field =>
//     field === 'DEPENDENT' || field === 'OTHER',
//   hideIf: (formData, index) =>
//     !['DEPENDENT', 'OTHER'].includes(
//       formData?.careExpenses?.[index]?.recipients,
//     ),
//   required: (formData, index) =>
//     ['DEPENDENT', 'OTHER'].includes(
//       formData?.careExpenses?.[index]?.recipients,
//     ),
// }),
//         provider: textUI('What’s the name of the care provider?'),
// careDate: currentOrPastDateRangeUI(
//   {
//     title: 'Care start date',
//     monthSelect: false,
//   },
//   {
//     title: 'Care end date',
//     monthSelect: false,
//   },
// ),
// noEndDate: checkboxUI('No end date'),
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
// careDate: {
//   ...currentOrPastDateRangeSchema,
//   required: ['from'],
// },
// noEndDate: checkboxSchema,
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
