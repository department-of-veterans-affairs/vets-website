import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-schema.json';

import { merge } from 'lodash';
import { serviceRecordsUI } from '../../utils/helpers';
import { validateSponsorDeathDate } from '../../validation';

const { veteran } = fullSchemaPreNeed.properties.application.properties;

export const uiSchema = {
  application: {
    // ORIGINAL STUFF BELOW
    // veteran: {
    //   serviceRecords: serviceRecordsUI,
    // },
    // 'ui:options': {
    //   customTitle: ' ',
    // },

    // TRYING TO MAKE THIS WORK SIMILARLY TO SPONSORDEATHDATE SINCE IT PASSES IN THE UI:VALIDATIONS WHICH MAKES SENSE.
    veteran: merge({}, serviceRecordsUI, {
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
          properties: {
            serviceRecords: veteran.properties.serviceRecords,
          },
        },
      },
    },
  },
};
