import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-INTEGRATION-schema.json';

import { merge, pick } from 'lodash';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';

import { veteranUI, sponsorDetailsSubHeader } from '../../utils/helpers';

const { veteran } = fullSchemaPreNeed.properties.application.properties;

export const uiSchema = {
  'ui:title': sponsorDetailsSubHeader,
  application: {
    veteran: merge({}, veteranUI, {
      dateOfBirth: currentOrPastDateUI('Sponsor’s date of birth'),
      placeOfBirth: {
        'ui:title': "Sponsor's place of birth (City, State, or Territory)",
      },
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
          properties: merge(
            {},
            pick(veteran.properties, ['dateOfBirth', 'placeOfBirth']),
          ),
        },
      },
    },
  },
};
