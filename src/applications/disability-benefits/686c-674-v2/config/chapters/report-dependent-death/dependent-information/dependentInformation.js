import {
  // addressNoMilitarySchema,
  // addressNoMilitaryUI,
  // currentOrPastDateRangeSchema,
  // currentOrPastDateRangeUI,
  // titleUI,
  fullNameNoSuffixUI,
  fullNameNoSuffixSchema,
  ssnUI,
  ssnSchema,
  currentOrPastDateUI,
  currentOrPastDateSchema,
  arrayBuilderItemFirstPageTitleUI,
  // arrayBuilderYesNoSchema,
  // arrayBuilderYesNoUI,
  // arrayBuilderItemSubsequentPageTitleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
// import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';
// import ArrayViewField from '../../../../components/ArrayViewField';
import dependentOptions from '../dependent-options/deceasedDependentOptions';

// export const schema = {
//   type: 'object',
//   properties: {
//     deaths: {
//       type: 'array',
//       minItems: 1,
//       maxItems: 100,
//       items: {
//         type: 'object',
//         properties: {
//           fullName: fullNameNoSuffixSchema,
//           ssn: ssnSchema,
//           birthDate: currentOrPastDateSchema,
//         },
//       },
//     },
//   },
// };

// export const uiSchema = {
//   ...titleUI('Dependents who have died'),
//   deaths: {
//     'ui:options': {
//       viewField: ArrayViewField,
//       itemName: 'Dependent who has died',
//       keepInPageOnReview: true,
//       customTitle: ' ',
//     },
//     items: {
//       fullName: fullNameNoSuffixUI(),
//       ssn: {
//         ...ssnUI('Dependent’s Social Security number'),
//         'ui:required': () => true,
//       },
//       birthDate: currentOrPastDateUI({
//         title: 'Dependent’s date of birth',
//         required: () => true,
//       }),
//     },
//   },
// };

// export const schema = {
//   type: 'object',
//   properties: {
//     deaths: {
//       type: 'array',
//       minItems: 1,
//       maxItems: 100,
//       items: {
//         type: 'object',
//         properties: {
//           fullName: fullNameNoSuffixSchema,
//           ssn: ssnSchema,
//           birthDate: currentOrPastDateSchema,
//         },
//       },
//     },
//   },
// };

// export const uiSchema = {
//   ...arrayBuilderItemFirstPageTitleUI({
//     title: 'Dependent who has died',
//     nounSingular: dependentOptions.nounSingular,
//   }),
//   fullName: fullNameNoSuffixUI(),
//   ssn: {
//     ...ssnUI('Dependent’s Social Security number'),
//     'ui:required': () => true,
//   },
//   birthDate: currentOrPastDateUI({
//     title: 'Dependent’s date of birth',
//     required: () => true,
//   }),
// };

/** @returns {PageSchema} */
const dependentInformation = {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'Dependent who has died',
      nounSingular: dependentOptions.nounSingular,
    }),
    fullName: fullNameNoSuffixUI(),
    ssn: {
      ...ssnUI('Dependent’s Social Security number'),
      'ui:required': () => true,
    },
    birthDate: currentOrPastDateUI({
      title: 'Dependent’s date of birth',
      required: () => true,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      fullName: fullNameNoSuffixSchema,
      ssn: ssnSchema,
      birthDate: currentOrPastDateSchema,
    },
    // required: ['name'],
  },
};

export default dependentInformation;
