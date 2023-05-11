import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-schema.json';
import set from 'platform/utilities/data/set';
import { merge } from 'lodash';

import fullNameUI from 'platform/forms/definitions/fullName';

import * as autosuggest from 'platform/forms-system/src/js/definitions/autosuggest';
import EligibleBuriedView from '../../components/EligibleBuriedView';

const {
  currentlyBuriedPersons,
} = fullSchemaPreNeed.properties.application.properties;

function currentlyBuriedPersonsMinItem() {
  const copy = { ...currentlyBuriedPersons };
  copy.minItems = 1;
  return set('items.properties.cemeteryNumber', autosuggest.schema, copy);
}

export const uiSchema = {
  application: {
    currentlyBuriedPersons: {
      'ui:options': {
        viewField: EligibleBuriedView,
      },
      items: {
        name: merge({}, fullNameUI, {
          'ui:title': 'Name of deceased',
        }),
      },
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    application: {
      type: 'object',
      properties: {
        currentlyBuriedPersons: currentlyBuriedPersonsMinItem(),
      },
    },
  },
};
