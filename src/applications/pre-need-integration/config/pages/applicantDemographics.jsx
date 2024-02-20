import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-INTEGRATION-schema.json';

import applicantDescription from 'platform/forms/components/ApplicantDescription';

import { pick } from 'lodash';

import environment from 'platform/utilities/environment';

import {
  applicantDemographicsDescription,
  applicantDemographicsSubHeader,
  veteranUI,
} from '../../utils/helpers';

const { veteran } = fullSchemaPreNeed.properties.application.properties;

export const uiSchema = !environment.isProduction()
  ? {
      application: {
        'ui:title': applicantDemographicsSubHeader,
        'view:applicantDemographicsDescription': {
          'ui:description': applicantDemographicsDescription,
          'ui:options': {
            displayEmptyObjectOnReview: true,
          },
        },
        veteran: veteranUI,
      },
    }
  : {
      'ui:description': applicantDescription,
      application: {
        'ui:title': applicantDemographicsSubHeader,
        'ui:description': applicantDemographicsDescription,
        veteran: veteranUI,
      },
    };
export const schema = !environment.isProduction()
  ? {
      type: 'object',
      properties: {
        application: {
          type: 'object',
          properties: {
            'view:applicantDemographicsDescription': {
              type: 'object',
              properties: {},
            },
            veteran: {
              type: 'object',
              required: ['gender', 'race', 'maritalStatus'],
              properties: pick(veteran.properties, [
                'gender',
                'race',
                'maritalStatus',
              ]),
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
            veteran: {
              type: 'object',
              required: ['gender', 'race', 'maritalStatus'],
              properties: pick(veteran.properties, [
                'gender',
                'race',
                'maritalStatus',
              ]),
            },
          },
        },
      },
    };
