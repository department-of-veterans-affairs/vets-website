// import {
//   titleUI,
//   currentOrPastDateUI,
//   currentOrPastDateSchema,
//   fullNameNoSuffixUI,
//   fullNameNoSuffixSchema,
//   ssnUI,
//   ssnSchema,
//   dateOfBirthUI,
//   dateOfBirthSchema,
// } from 'platform/forms-system/src/js/web-component-patterns';
// import { TASK_KEYS } from '../../../constants';
// import { isChapterFieldRequired } from '../../../helpers';

// export const schema = {
//   type: 'object',
//   properties: {
//     reportDivorce: {
//       type: 'object',
//       properties: {
//         date: currentOrPastDateSchema,
//         location: {},
//         reasonMarriageEnded: {},
//         explanationOfOther: {},
//       },
//     },
//   },
// };

// export const uiSchema = {
//   reportDivorce: {
//     ...titleUI('Divorced spouse’s information'),
//     date: merge(currentOrPastDateUI('Date of divorce'), {
//       'ui:required': formData =>
//         isChapterFieldRequired(formData, TASK_KEYS.reportDivorce),
//     }),
//     location: locationUISchema(
//       'reportDivorce',
//       'location',
//       false,
//       'Where did this marriage end?',
//       TASK_KEYS.reportDivorce,
//     ),
//     reasonMarriageEnded: {
//       'ui:required': formData =>
//         isChapterFieldRequired(formData, TASK_KEYS.reportDivorce),
//       'ui:title': 'Reason marriage ended',
//       'ui:widget': 'radio',
//       'ui:errorMessages': {
//         required: 'Select an option',
//       },
//       'ui:options': {
//         updateSchema: () => ({
//           enumNames: ['Divorce', 'Annulment or other'],
//         }),
//       },
//     },
//     explanationOfOther: {
//       'ui:title': 'Give a brief explanation',
//       'ui:required': formData =>
//         formData?.reportDivorce?.reasonMarriageEnded === 'Other',
//       'ui:options': {
//         expandUnder: 'reasonMarriageEnded',
//         expandUnderCondition: 'Other',
//       },
//     },
//   },
// };
