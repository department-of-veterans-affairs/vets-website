import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-schema.json';

import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';

import { merge, pick } from 'lodash';

import {
  applicantDetailsDescription,
  applicantDetailsSubHeader,
  fullMaidenNameUI,
  ssnDashesUI,
} from '../../utils/helpers';

const { claimant } = fullSchemaPreNeed.properties.application.properties;

export const uiSchema = {
  application: {
    'ui:title': applicantDetailsSubHeader,
    claimant: {
      'view:applicantDetailsDescription': {
        'ui:description': applicantDetailsDescription,
        'ui:options': {
          displayEmptyObjectOnReview: true,
        },
      },
      name: fullMaidenNameUI,
      ssn: ssnDashesUI,
      dateOfBirth: currentOrPastDateUI('Date of birth'),
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    application: {
      type: 'object',
      properties: {
        claimant: {
          type: 'object',
          required: ['name', 'ssn', 'dateOfBirth'],
          properties: merge(
            {},
            {
              'view:applicantDetailsDescription': {
                type: 'object',
                properties: {},
              },
            },
            pick(claimant.properties, ['name', 'ssn', 'dateOfBirth']),
          ),
        },
      },
    },
  },
};
