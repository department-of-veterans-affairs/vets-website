import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-schema.json';

import * as autosuggest from 'platform/forms-system/src/js/definitions/autosuggest';

import {
  isVeteran,
  getCemeteries,
  desiredCemeteryNoteDescription,
} from '../../utils/helpers';

const {
  hasCurrentlyBuried,
} = fullSchemaPreNeed.properties.application.properties;

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
      },
    },
  },
};
