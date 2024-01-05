import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';

import {
  fullNameUI,
  yesNoUI,
  yesNoSchema,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';
import FullNameField from '@department-of-veterans-affairs/platform-forms-system/FullNameField';
import { VaTextInputField } from '@department-of-veterans-affairs/platform-forms-system/web-component-fields';

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
        itemName: 'Name',
        expandUnder: 'serveUnderOtherNames',
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
