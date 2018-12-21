import * as autosuggest from 'us-forms-system/lib/js/definitions/autosuggest';
import disabilityLabels from '../content/disabilityLabels';
import { uiDescription } from '../content/addDisabilities';
import NewDisability from '../components/NewDisability';

import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

const { condition } = fullSchema.definitions.newDisabilities.items.properties;

export const uiSchema = {
  'ui:description': 'Please tell us the new conditions you want to claim.',
  newDisabilities: {
    'ui:title': 'New condition',
    'ui:options': {
      viewField: NewDisability,
      reviewTitle: 'New Disabilities',
      itemName: 'Disability',
    },
    items: {
      condition: autosuggest.uiSchema(
        'If you know the name of your condition, you can type it here. You can write whatever you want and we’ll make suggestions for possible disabilities (for example, foot pain, back pain, or hearing loss).',
        () =>
          Promise.resolve(
            Object.entries(disabilityLabels).map(([key, value]) => ({
              id: key,
              label: value,
            })),
          ),
        {
          'ui:options': {
            freeInput: true,
          },
        },
      ),
      'view:descriptionInfo': {
        'ui:description': uiDescription,
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    newDisabilities: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        required: ['condition'],
        properties: {
          condition,
          'view:descriptionInfo': { type: 'object', properties: {} },
        },
      },
    },
  },
};
