import * as autosuggest from 'platform/forms-system/src/js/definitions/autosuggest';
import disabilityLabels from '../content/disabilityLabels';
import {
  descriptionInfo,
  autoSuggestTitle,
  disabilityRequiredAlert,
} from '../content/addDisabilities';
import NewDisability from '../components/NewDisability';
import ArrayField from '../components/ArrayField';
import { validateDisabilityName, requireDisability } from '../validations';
import { hasClaimedConditions } from '../utils';

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
  'view:newDisabilityError': {
    'ui:description': disabilityRequiredAlert,
    // Put the validation here instead of on the condition so the user can't continue to the next page but
    //  aren't bombarded with two validation errors.
    'ui:validations': [requireDisability],
    'ui:options': {
      hideIf: hasClaimedConditions,
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
    'view:newDisabilityError': { type: 'object', properties: {} },
  },
};
