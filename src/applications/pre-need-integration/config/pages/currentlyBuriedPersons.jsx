import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-INTEGRATION-schema.json';
import set from 'platform/utilities/data/set';
import { merge } from 'lodash';
import * as autosuggest from 'platform/forms-system/src/js/definitions/autosuggest';
import fullNameUI from '../../definitions/fullName';

import EligibleBuriedView from '../../components/EligibleBuriedView';

import { getCemeteries } from '../../utils/helpers';
import DeceasedPersons from '../../components/DeceasedPersons';

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
      'ui:field': DeceasedPersons,
      'ui:options': {
        viewField: EligibleBuriedView,
        keepInPageOnReview: true,
        showSave: true,
        confirmRemove: true,
        itemName: 'deceased person',
      },
      items: {
        name: merge({}, fullNameUI),
        cemeteryNumber: autosuggest.uiSchema(
          'VA national cemetery where they’re buried',
          getCemeteries,
          {
            'ui:options': {
              hideIf: () => true,
            },
          },
        ),
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
      currentlyBuriedPersons,
    },
  },
};
