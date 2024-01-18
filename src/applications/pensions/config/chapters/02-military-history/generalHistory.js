import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';

import {
  fullNameUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import FullNameField from 'platform/forms-system/src/js/fields/FullNameField';
import { VaTextInputField } from 'platform/forms-system/src/js/web-component-fields';

const { placeOfSeparation, previousNames } = fullSchemaPensions.properties;

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Other service names',
    serveUnderOtherNames: yesNoUI({
      title: 'Did you serve under another name?',
      uswds: true,
      classNames: 'vads-u-margin-bottom--2',
    }),
    previousNames: {
      'ui:options': {
        itemName: 'Other Name',
        expandUnder: 'serveUnderOtherNames',
        viewField: FullNameField,
        reviewTitle: 'Previous names',
        keepInPageOnReview: true,
      },
      items: fullNameUI(),
    },
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
      previousNames: {
        ...previousNames,
        minItems: 1,
      },
      placeOfSeparation,
    },
  },
};
