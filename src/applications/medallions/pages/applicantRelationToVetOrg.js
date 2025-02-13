import { textUI } from 'platform/forms-system/src/js/web-component-patterns';

import {
  //   finishAppLaterLink,
  applicantRelationToVetHeaders,
} from '../utils/helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:description': applicantRelationToVetHeaders,
    exampleText: textUI({
      title: 'Text field',
      hint: 'This is a hint',
      description: 'This is a description',
      charcount: true, // Used with minLength and maxLength in the schema
    }),
  },
  schema: {
    type: 'object',
    properties: {
      exampleText: {
        type: 'string',
        minLength: 10,
        maxLength: 30,
      },
    },
  },
};
