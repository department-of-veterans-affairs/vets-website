import {
  arrayBuilderItemFirstPageTitleUI,
  // arrayBuilderItemSubsequentPageTitleUI,
  // arrayBuilderYesNoSchema,
  // arrayBuilderYesNoUI,
  // currentOrPastDateSchema,
  // currentOrPastDateUI,
  // textUI,
  // textSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
// import { arrayBuilderPages } from '~/platform/forms-system/src/js/patterns/array-builder';
// import { formatReviewDate } from 'platform/forms-system/src/js/helpers';
// import { generateTransition } from '../../../helpers';

// export const schema = {
//   type: 'object',
//   properties: {
//     'view:dependentsAdditionalInfo': {
//       type: 'object',
//       properties: {},
//     },
//   },
// };

// export const uiSchema = {
//   'view:dependentsAdditionalInfo': {
//     'ui:description': generateTransition(
//       'Now we’re going to ask you some follow-up questions about each of your dependents who have died. We’ll go through them one by one.',
//     ),
//     'ui:options': {
//       hideOnReview: true,
//     },
//   },
// };

// export const schema = {
//   type: 'object',
//   properties: {},
// };

// export const uiSchema = {
//   ...arrayBuilderItemFirstPageTitleUI(
//     'Dependents who have died',
//     'In the next few questions, we’ll ask you about your dependents who have died. You must add at least one dependent. You may add up to 5 dependents.',
//   ),
// };

/** @returns {PageSchema} */
export default {
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI(
      'Dependents who have died',
      'In the next few questions, we’ll ask you about your dependents who have died. You must add at least one dependent. You may add up to 5 dependents.',
    ),
  },
  schema: {
    type: 'object',
    properties: {},
  },
};
