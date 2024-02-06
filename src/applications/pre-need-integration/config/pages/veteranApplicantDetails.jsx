import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-INTEGRATION-schema.json';

import applicantDescription from 'platform/forms/components/ApplicantDescription';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';

import { merge, pick } from 'lodash';

import environment from 'platform/utilities/environment';

import {
  applicantDetailsDescription,
  applicantDetailsSubHeader,
  fullMaidenNameUI,
  ssnDashesUI,
} from '../../utils/helpers';

const {
  claimant,
  veteran,
} = fullSchemaPreNeed.properties.application.properties;

export const uiSchema = !environment.isProduction()
  ? {
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
        veteran: {
          placeOfBirth: {
            'ui:title': 'Place of birth (city, state, territory)',
          },
        },
      },
    }
  : {
      'ui:description': applicantDescription,
      application: {
        'ui:title': applicantDetailsSubHeader,
        claimant: {
          name: fullMaidenNameUI,
          ssn: ssnDashesUI,
          dateOfBirth: currentOrPastDateUI('Date of birth'),
        },
        veteran: {
          placeOfBirth: {
            'ui:title': 'Place of birth (city, state, territory)',
          },
        },
      },
    };
export const schema = !environment.isProduction()
  ? {
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
            veteran: {
              type: 'object',
              required: ['placeOfBirth'],
              properties: pick(veteran.properties, ['placeOfBirth']),
            },
          },
        },
      },
    }
  : {
      type: 'object',
      properties: {
        application: {
          type: 'object',
          properties: {
            claimant: {
              type: 'object',
              required: ['name', 'ssn', 'dateOfBirth'],
              properties: pick(claimant.properties, [
                'name',
                'ssn',
                'dateOfBirth',
              ]),
            },
            veteran: {
              type: 'object',
              required: ['placeOfBirth'],
              properties: pick(veteran.properties, ['placeOfBirth']),
            },
          },
        },
      },
    };
