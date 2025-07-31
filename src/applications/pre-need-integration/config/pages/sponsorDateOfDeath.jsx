import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-schema.json';

import { merge, pick } from 'lodash';
import { currentOrPastDateUI } from 'platform/forms-system/src/js/web-component-patterns';
import { veteranUI } from '../../utils/helpers';
import { validateSponsorDeathDate } from '../../validation';

const { veteran } = fullSchemaPreNeed.properties.application.properties;

export const uiSchema = {
  application: {
    veteran: merge({}, veteranUI, {
      dateOfDeath: currentOrPastDateUI('When did the sponsor die?'),
      'ui:validations': [validateSponsorDeathDate],
    }),
  },
  'ui:options': {
    itemName: 'sponsor’s death date',
  },
};

export const schema = {
  type: 'object',
  properties: {
    application: {
      type: 'object',
      properties: {
        veteran: {
          type: 'object',
          properties: pick(veteran.properties, ['dateOfDeath']),
        },
      },
    },
  },
};
