import currentOrPastDateUI from '@department-of-veterans-affairs/platform-forms-system/currentOrPastDate';
import fullNameUI from '@department-of-veterans-affairs/platform-forms-system/fullName';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';

import { dependentsMinItem } from '../../../helpers';
import DependentField from '../../../components/DependentField';

const { dependents } = fullSchemaPensions.properties;

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Dependent children',
    dependents: {
      'ui:options': {
        itemName: 'Dependent',
        viewField: DependentField,
        reviewTitle: 'Dependent children',
      },
      'ui:errorMessages': {
        minItems: dependentsMinItem,
      },
      items: {
        fullName: fullNameUI,
        childDateOfBirth: currentOrPastDateUI('Date of birth'),
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      dependents: {
        type: 'array',
        minItems: 1,
        items: {
          type: 'object',
          required: ['fullName', 'childDateOfBirth'],
          properties: {
            fullName: dependents.items.properties.fullName,
            childDateOfBirth: dependents.items.properties.childDateOfBirth,
          },
        },
      },
    },
  },
};
