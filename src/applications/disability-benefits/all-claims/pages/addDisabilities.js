import * as autosuggest from 'us-forms-system/lib/js/definitions/autosuggest';
import disabilityLabels from '../content/disabilityLabels';
import NewDisability from '../components/NewDisability';

import fullSchema from '../config/schema';

const {
  diagnosticCode
} = fullSchema.properties.newDisabilities.items.properties;

export const uiSchema = {
  newDisabilities: {
    'ui:title': 'Add a new disability',
    'ui:options': {
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
  properties: {
    newDisabilities: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          diagnosticCode
        }
      }
    }
  }
};
