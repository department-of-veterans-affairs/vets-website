import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';

import {
  fullNameUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import FullNameField from 'platform/forms-system/src/js/fields/FullNameField';
import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';

const { placeOfSeparation, previousNames } = fullSchemaPensions.properties;

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Other service names',
    'view:serveUnderOtherNames': yesNoUI({
      title: 'Did you serve under another name?',
      uswds: true,
      classNames: 'vads-u-margin-bottom--2',
    }),
    previousNames: {
      'ui:options': {
        itemName: 'Name',
        expandUnder: 'view:serveUnderOtherNames',
        viewField: FullNameField,
        reviewTitle: 'Previous names',
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
    required: ['view:serveUnderOtherNames'],
    properties: {
      'view:serveUnderOtherNames': yesNoSchema,
      previousNames: {
        ...previousNames,
        minItems: 1,
      },
      placeOfSeparation,
    },
  },
};
