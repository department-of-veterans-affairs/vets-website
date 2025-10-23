import {
  arrayBuilderItemSubsequentPageTitleUI,
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';

import { createNewConditionName } from './utils';

export const causeOptions = {
  NEW:
    'An injury, exposure, event, or onset of disease during my military service',
  SECONDARY: 'A service-connected disability I already have',
  WORSENED:
    'An existing condition I had before my service that worsened because of my service',
  VA: 'An injury, exposure, or event due to care I received from VA',
};

/** @returns {PageSchema} */
const causePage = {
  uiSchema: {
    ...arrayBuilderItemSubsequentPageTitleUI(
      ({ formData }) => createNewConditionName(formData, true),
      undefined,
      false,
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
