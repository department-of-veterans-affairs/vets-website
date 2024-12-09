import {
  currentOrPastMonthYearDateSchema,
  currentOrPastMonthYearDateUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { CONDITIONS_FIRST } from '../constants';
import { createItemName } from './conditionsFirstPages/utils';

/** @type {PageSchema} */
export default {
  title: formData => `Start date of ${createItemName(formData)}`,
  depends: formData => formData.demo === 'CONDITIONS_FIRST',
  path: `new-conditions-${CONDITIONS_FIRST}-follow-up-date/:index`,
  showPagePerItem: true,
  arrayPath: 'conditionsFirst',
  uiSchema: {
    'ui:title': 'Conditions follow up - Date',
    conditionsFirst: {
      items: {
        ...titleUI(
          ({ formData }) => `Start date of ${createItemName(formData)}`,
        ),
        date: currentOrPastMonthYearDateUI({
          title: 'What’s the approximate date your condition started?',
        }),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      conditionsFirst: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            date: currentOrPastMonthYearDateSchema,
          },
          required: ['date'],
        },
      },
    },
  },
};
