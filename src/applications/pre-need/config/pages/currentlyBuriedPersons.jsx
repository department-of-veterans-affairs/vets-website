import React from 'react';
import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-schema.json';
import set from 'platform/utilities/data/set';
import { merge } from 'lodash';
import * as autosuggest from 'platform/forms-system/src/js/definitions/autosuggest';
import { useSelector } from 'react-redux';
import fullNameUI from '../../definitions/fullName';

import EligibleBuriedView from '../../components/EligibleBuriedView';

import { isVeteran, getCemeteries } from '../../utils/helpers';

const {
  currentlyBuriedPersons,
} = fullSchemaPreNeed.properties.application.properties;

function currentlyBuriedPersonsMinItem() {
  const copy = { ...currentlyBuriedPersons };
  copy.minItems = 1;
  return set('items.properties.cemeteryNumber', autosuggest.schema, copy);
}

function CurrentlyBuriedPersonsDescription() {
  const data = useSelector(state => state.form.data || {});
  return isVeteran(data)
    ? 'Please provide the details of the person(s) currently buried in a VA national cemetery under your eligibility.'
    : 'Please provide the details of the person(s) currently buried in a VA national cemetery under your sponsor’s eligibility.';
}

export const uiSchema = {
  application: {
    currentlyBuriedPersons: {
      'ui:title': (
        <span>
          <h3 className="name-of-deceased-text">Name of deceased person</h3>
        </span>
      ),
      'ui:description': CurrentlyBuriedPersonsDescription,
      'ui:options': {
        viewField: EligibleBuriedView,
        keepInPageOnReview: true,
        itemName: 'Name of deceased',
      },
      items: {
        name: merge({}, fullNameUI),
        cemeteryNumber: autosuggest.uiSchema(
          'VA national cemetery where they’re buried',
          getCemeteries,
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
