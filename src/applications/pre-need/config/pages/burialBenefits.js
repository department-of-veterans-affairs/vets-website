import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-schema.json';
import set from 'platform/utilities/data/set';
import { merge } from 'lodash';

import fullNameUI from 'platform/forms/definitions/fullName';

import * as autosuggest from 'platform/forms-system/src/js/definitions/autosuggest';
import EligibleBuriedView from '../../components/EligibleBuriedView';

import {
  isVeteran,
  getCemeteries,
  desiredCemeteryNoteDescription,
} from '../../utils/helpers';

const {
  hasCurrentlyBuried,
  currentlyBuriedPersons,
} = fullSchemaPreNeed.properties.application.properties;

function currentlyBuriedPersonsMinItem() {
  const copy = { ...currentlyBuriedPersons };
  copy.minItems = 1;
  return set('items.properties.cemeteryNumber', autosuggest.schema, copy);
}

export const uiSchema = {
  application: {
    claimant: {
      desiredCemetery: autosuggest.uiSchema(
        'Which VA national cemetery would you prefer to be buried in?',
        getCemeteries,
        {
          'ui:options': {
            inputProps: {
              'aria-describedby': 'burial-cemetary-note',
            },
          },
        },
      ),
      'view:desiredCemeteryNote': {
        'ui:description': desiredCemeteryNoteDescription,
      },
    },
    hasCurrentlyBuried: {
      'ui:widget': 'radio',
      'ui:options': {
        updateSchema: formData => {
          let title;
          if (isVeteran(formData)) {
            /* eslint-disable no-param-reassign */
            title =
              'Is there anyone currently buried in a VA national cemetery under your eligibility?';
          } else {
            title =
              'Is there anyone currently buried in a VA national cemetery under your sponsor’s eligibility?';
            /* eslint-enable no-param-reassign */
          }
          return { title };
        },
        labels: {
          1: 'Yes',
          2: 'No',
          3: 'I don’t know',
        },
      },
    },
    currentlyBuriedPersons: {
      'ui:options': {
        viewField: EligibleBuriedView,
        expandUnder: 'hasCurrentlyBuried',
        expandUnderCondition: '1',
      },
      items: {
        name: merge({}, fullNameUI, {
          'ui:title': 'Name of deceased',
        }),
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
      required: ['hasCurrentlyBuried'],
      properties: {
        claimant: {
          type: 'object',
          properties: {
            desiredCemetery: autosuggest.schema,
            'view:desiredCemeteryNote': {
              type: 'object',
              properties: {},
            },
          },
        },
        hasCurrentlyBuried,
        currentlyBuriedPersons: currentlyBuriedPersonsMinItem(),
      },
    },
  },
};
