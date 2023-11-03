import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-schema.json';

import { merge, pick } from 'lodash';
import applicantDescription from 'platform/forms/components/ApplicantDescription';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import { veteranUI } from '../../utils/helpers';
import { validateSponsorDeathDate } from '../../validation';

const { veteran } = fullSchemaPreNeed.properties.application.properties;

export const uiSchema = {
  'ui:description': applicantDescription,
  application: {
    veteran: merge({}, veteranUI, {
      dateOfDeath: currentOrPastDateUI('Sponsor’s date of death'),
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
