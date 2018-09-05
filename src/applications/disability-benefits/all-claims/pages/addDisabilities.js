import * as autosuggest from 'us-forms-system/lib/js/definitions/autosuggest';
import disabilityLabels from '../content/disabilityLabels';
import NewDisability from '../components/NewDisability';

import fullSchema from '../config/schema';

const {
  diagnosticCode
} = fullSchema.properties.newDisabilities.items.properties;

export const uiSchema = {
  'view:newDisabilities': {
    'ui:title': 'Do you have new disabilities to add?',
    'ui:widget': 'yesNo'
  },
  newDisabilities: {
    'ui:title': 'Add a new disability',
    'ui:options': {
      expandUnder: 'view:newDisabilities',
      viewField: NewDisability,
      reviewTitle: 'New Disabilities',
      itemName: 'Disability'
    },
    items: {
      diagnosticCode: autosuggest.uiSchema(
        'Please describe your disability. (Please provide as much detail as possible.)',
        null,
        {
          'ui:options': {
            labels: disabilityLabels
          }
        })
    }
  }
};

export const schema = {
  type: 'object',
  required: ['view:newDisabilities'],
  properties: {
    'view:newDisabilities': {
      type: 'boolean'
    },
    newDisabilities: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        required: ['diagnosticCode'],
        properties: {
          diagnosticCode
        }
      }
    }
  }
};
