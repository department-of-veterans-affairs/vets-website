import * as autosuggest from 'platform/forms-system/src/js/definitions/autosuggest';
import disabilityLabels from '../content/disabilityLabels';
import {
  descriptionInfo,
  autoSuggestTitle,
  newOnlyAlert,
  increaseAndNewAlert,
} from '../content/addDisabilities';
import NewDisability from '../components/NewDisability';
import ArrayField from '../components/ArrayField';
import { validateDisabilityName, requireDisability } from '../validations';
import {
  newConditionsOnly,
  newAndIncrease,
  hasClaimedConditions,
} from '../utils';

import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

const { condition } = fullSchema.definitions.newDisabilities.items.properties;

export const uiSchema = {
  'ui:description': 'Please tell us the new conditions you want to claim.',
  newDisabilities: {
    'ui:title': 'New condition',
    'ui:field': ArrayField,
    'ui:options': {
      viewField: NewDisability,
      reviewTitle: 'New Disabilities',
      itemName: 'Disability',
    },
    // Ideally, this would show the validation on the array itself (or the name field in an array
    //  item), but that's not working.
    'ui:validations': [requireDisability],
    items: {
      condition: autosuggest.uiSchema(
        autoSuggestTitle,
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
            inputTransformers: [
              // Replace a bunch of things that aren't valid with valid equivalents
              input => input.replace(/["”']/g, '’'),
              input => input.replace(/[;–]/g, ' -- '),
              input => input.replace(/[&]/g, ' and '),
              input => input.replace(/[\\]/g, '/'),
              // Strip out everything that's not valid and doesn't need to be replaced
              input => input.replace(/([^a-zA-Z0-9\-’.,/() ]+)/g, ''),
              // Get rid of extra whitespace characters
              input => input.trim(),
              input => input.replace(/\s{2,}/, ' '),
            ],
          },
          // autoSuggest schema doesn't have any default validations as long as { `freeInput: true` }
          'ui:validations': [validateDisabilityName],
        },
      ),
      'view:descriptionInfo': {
        'ui:description': descriptionInfo,
      },
    },
  },
  // This object only shows up when the user tries to continue without claiming either a rated or new condition
  'view:newDisabilityErrors': {
    'view:newOnlyAlert': {
      'ui:description': newOnlyAlert,
      'ui:options': {
        hideIf: formData =>
          !newConditionsOnly(formData) || hasClaimedConditions(formData),
      },
    },
    'view:increaseAndNewAlert': {
      'ui:description': increaseAndNewAlert,
      'ui:options': {
        hideIf: formData =>
          // Only show this alert if the veteran is claiming both rated and new conditions
          !newAndIncrease(formData) || hasClaimedConditions(formData),
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
        properties: {
          condition,
          'view:descriptionInfo': { type: 'object', properties: {} },
        },
      },
    },
    'view:newDisabilityErrors': {
      type: 'object',
      properties: {
        'view:newOnlyAlert': { type: 'object', properties: {} },
        'view:increaseAndNewAlert': { type: 'object', properties: {} },
      },
    },
  },
};
