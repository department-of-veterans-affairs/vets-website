import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-schema.json';

import { merge, pick } from 'lodash';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import { sponsorDateOfDeathSubheader, veteranUI } from '../../utils/helpers';
import { validateSponsorDeathDate } from '../../validation';

const { veteran } = fullSchemaPreNeed.properties.application.properties;

export const uiSchema = {
  application: {
    veteran: merge({}, veteranUI, {
      dateOfDeath: currentOrPastDateUI(sponsorDateOfDeathSubheader),
      'ui:validations': [validateSponsorDeathDate],
    }),
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
