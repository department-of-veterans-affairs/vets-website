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
      'ui:description': environment.isProduction() ? applicantDescription : '', // Connor Fewin - MBMS-53309 (delete entire line when removing prod flag)
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
      /* 
       * Connor Fewin - MBMS-53309 (delete entire line when removing prod flag) 
       * This is fine to be deleted when the parent prod flag is deleted.
       */
      'ui:description': environment.isProduction() ? applicantDescription : '',
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
