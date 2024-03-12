import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-INTEGRATION-schema.json';

import { merge, pick } from 'lodash';

import {
  veteranUI,
  ssnDashesUI,
  sponsorDetailsGuidingText,
} from '../../utils/helpers';

const { veteran } = fullSchemaPreNeed.properties.application.properties;

export const uiSchema = {
  'ui:title': 'PLACEHOLDER',
  application: {
    veteran: merge({}, veteranUI, {
      'view:sponsorDetailsDescription': {
        'ui:description': sponsorDetailsGuidingText,
        'ui:options': {
          displayEmptyObjectOnReview: true,
        },
      },
      ssn: {
        ...ssnDashesUI,
        'ui:title': 'Sponsor’s Social Security number',
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
          required: ['ssn'],
          properties: merge(
            {},
            {
              'view:sponsorDetailsDescription': {
                type: 'object',
                properties: {},
              },
            },
            pick(veteran.properties, ['ssn']),
          ),
        },
      },
    },
  },
};
