import merge from 'lodash/merge';
import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';

import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import fullNameUI from 'platform/forms/definitions/fullName';

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
        keepInPageOnReview: true,
        customTitle: ' ',
        confirmRemove: true,
        useDlWrap: true,
      },
      'ui:errorMessages': {
        minItems: dependentsMinItem,
      },
      items: {
        fullName: merge({}, fullNameUI, {
          first: {
            'ui:title': 'Child’s first name',
          },
          last: {
            'ui:title': 'Child’s last name',
          },
          middle: {
            'ui:title': 'Child’s middle name',
          },
          suffix: {
            'ui:title': 'Child’s suffix',
          },
        }),
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
