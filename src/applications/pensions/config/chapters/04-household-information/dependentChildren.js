import currentOrPastDateUI from '@department-of-veterans-affairs/platform-forms-system/currentOrPastDate';
import fullNameUI from '@department-of-veterans-affairs/platform-forms-system/fullName';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';
import {
  yesNoSchema,
  yesNoUI,
} from '@department-of-veterans-affairs/platform-forms-system/web-component-patterns';

import { dependentsMinItem } from '../../../helpers';
import DependentField from '../../../components/DependentField';

const { dependents } = fullSchemaPensions.properties;

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Dependent children',
    'view:hasDependents': yesNoUI({
      title: 'Do you have any dependent children?',
    }),
    dependents: {
      'ui:options': {
        itemName: 'Dependent',
        expandUnder: 'view:hasDependents',
        viewField: DependentField,
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
    required: ['view:hasDependents'],
    properties: {
      'view:hasDependents': yesNoSchema,
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
