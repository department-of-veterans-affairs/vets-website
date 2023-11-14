import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';

import FullNameField from 'platform/forms-system/src/js/fields/FullNameField';
import { fullNameUI } from 'platform/forms-system/src/js/web-component-patterns';

const { placeOfSeparation, previousNames } = fullSchemaPensions.properties;

/** @type {PageSchema} */
export default {
  uiSchema: {
    'view:serveUnderOtherNames': {
      'ui:title': 'Did you serve under another name?',
      'ui:widget': 'yesNo',
    },
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
        'Place of last or anticipated separation (city and state or foreign country)',
    },
  },
  schema: {
    type: 'object',
    required: ['view:serveUnderOtherNames'],
    properties: {
      'view:serveUnderOtherNames': {
        type: 'boolean',
      },
      previousNames: {
        ...previousNames,
        minItems: 1,
      },
      placeOfSeparation,
    },
  },
};
