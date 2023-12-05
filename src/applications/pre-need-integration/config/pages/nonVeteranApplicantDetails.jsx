import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-schema.json';

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

const { claimant } = fullSchemaPreNeed.properties.application.properties;

export const uiSchema = !environment.isProduction()
  ? {
      'ui:description': applicantDescription,
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
          },
        },
      },
    };
