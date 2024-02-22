import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';

import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';

const { placeOfSeparation } = fullSchemaPensions.properties;

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Other service names',
    serveUnderOtherNames: yesNoUI({
      title: 'Did you serve under another name?',
      classNames: 'vads-u-margin-bottom--2',
    }),
    placeOfSeparation: {
      'ui:title':
        'Place of your last separation (City, state or foreign country)',
      'ui:webComponentField': VaTextInputField,
    },
  },
  schema: {
    type: 'object',
    required: ['serveUnderOtherNames'],
    properties: {
      serveUnderOtherNames: yesNoSchema,
      placeOfSeparation,
    },
  },
};
