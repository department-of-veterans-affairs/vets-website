import React from 'react';

import {
  arrayBuilderItemSubsequentPageTitleUI,
  descriptionUI,
  textUI,
  textSchema,
} from '~/platform/forms-system/src/js/web-component-patterns';
import { conflictOfInterestPolicy } from '../helpers';

const fileNumberPattern = '^[cC]{0,1}\\d{7,9}$';

const uiSchema = {
  ...arrayBuilderItemSubsequentPageTitleUI(
    'Information on an individual with a potential conflict of interest who receives VA educational benefits',
  ),
  ...descriptionUI(<>{conflictOfInterestPolicy}</>),
  fileNumber: textUI({
    title: "Individual's VA file number",
    hint:
      "This can be the individual's Social Security number or claim number.",
    required: () => true,
    errorMessages: {
      required: 'Please enter a VA file number',
      pattern: 'You must provide a valid VA file number',
    },
  }),
};

const schema = {
  type: 'object',
  properties: {
    fileNumber: {
      ...textSchema,
      pattern: fileNumberPattern,
    },
  },
  required: ['fileNumber'],
};

export { schema, uiSchema };
