import {
  arrayBuilderYesNoSchema,
  arrayBuilderYesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { arrayBuilderOptions } from './utils';

/**
 * This page is skipped on the first loop for required flow
 * Cards are populated on this page above the uiSchema if items are present
 *
 * @returns {PageSchema}
 */
const summaryPage = {
  uiSchema: {
    'view:hasConditions': arrayBuilderYesNoUI(
      arrayBuilderOptions,
      {},
      {
        hint: ' ', // Because there is maxItems: 100 if this empty string is not present the hint will count down from 100 which is a confusing user experience
      },
    ),
  },
  schema: {
    type: 'object',
    properties: {
      'view:hasConditions': arrayBuilderYesNoSchema,
    },
    required: ['view:hasConditions'],
  },
};

export default summaryPage;
