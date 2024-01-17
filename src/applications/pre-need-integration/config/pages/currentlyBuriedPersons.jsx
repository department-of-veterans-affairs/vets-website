import React from 'react';
import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-schema.json';
import set from 'platform/utilities/data/set';
import { merge } from 'lodash';
import * as autosuggest from 'platform/forms-system/src/js/definitions/autosuggest';
import fullNameUI from '../../definitions/fullName';

import EligibleBuriedView from '../../components/EligibleBuriedView';

import {
  getCemeteries,
  CurrentlyBurriedPersonsDescriptionWrapper,
} from '../../utils/helpers';
import DeceasedPersons from '../../components/DeceasedPersons';

const {
  currentlyBuriedPersons,
} = fullSchemaPreNeed.properties.application.properties;

function currentlyBuriedPersonsMinItem() {
  const copy = { ...currentlyBuriedPersons };
  copy.minItems = 1;
  return set('items.properties.cemeteryNumber', autosuggest.schema, copy);
}

export const currentlyBuriedPersonsTitle = (
  <h3 className="vads-u-font-size--h5">Name of deceased person(s)</h3>
);

export const currentlyBuriedPersonsTitleWrapper = (
  <CurrentlyBuriedPersonsTitle />
);

function CurrentlyBuriedPersonsTitle() {
  return currentlyBuriedPersonsTitle;
}

export const uiSchema = {
  application: {
    currentlyBuriedPersons: {
      'ui:title': currentlyBuriedPersonsTitleWrapper,
      'ui:field': DeceasedPersons,
      'ui:description': CurrentlyBurriedPersonsDescriptionWrapper,
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
