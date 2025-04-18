import {
  arrayBuilderItemSubsequentPageTitleUI,
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { createNewConditionName } from './utils';

export const causeOptions = {
  NEW:
    'An exposure, event, injury, or onset of disease during my military service',
  SECONDARY: 'A service-connected disability or condition I already have',
  WORSENED:
    'An existing condition I had before I served, but that got worse because of my service',
  VA: 'An exposure, event, or injury while I was receiving VA care',
};

/** @returns {PageSchema} */
const causePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) => `Cause of ${createNewConditionName(formData)}`,
    ),
    cause: radioUI({
      title: 'What caused your condition?',
      labels: causeOptions,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      cause: radioSchema(Object.keys(causeOptions)),
    },
    required: ['cause'],
  },
};

export default causePage;
