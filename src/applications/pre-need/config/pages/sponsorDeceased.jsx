import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-schema.json';

import environment from 'platform/utilities/environment';

import { merge, pick } from 'lodash';
import { veteranUI, sponsorDeceasedDescription } from '../../utils/helpers';

const { veteran } = fullSchemaPreNeed.properties.application.properties;

// prod flag for MBMS-47182
export const uiSchema = !environment.isProduction()
  ? {
      application: {
        veteran: merge({}, veteranUI, {
          'view:sponsorDeceasedDescription': {
            'ui:description': sponsorDeceasedDescription,
            'ui:options': {
              displayEmptyObjectOnReview: true,
            },
          },
          isDeceased: {
            'ui:title': 'Has the sponsor passed away?',
            'ui:widget': 'radio',
            'ui:options': {
              labels: {
                yes: 'Yes',
                no: 'No',
                unsure: 'I don’t know',
              },
            },
          },
        }),
      },
    }
  : {
      application: {
        veteran: merge({}, veteranUI, {
          isDeceased: {
            'ui:title': 'Has the sponsor died?',
            'ui:widget': 'radio',
            'ui:options': {
              labels: {
                yes: 'Yes',
                no: 'No',
                unsure: 'I don’t know',
              },
            },
          },
        }),
      },
    };

export const schema = !environment.isProduction()
  ? {
      type: 'object',
      properties: {
        application: {
          type: 'object',
          properties: {
            veteran: {
              type: 'object',
              required: ['isDeceased'],
              properties: merge(
                {},
                {
                  'view:sponsorDeceasedDescription': {
                    type: 'object',
                    properties: {},
                  },
                },
                pick(veteran.properties, ['isDeceased']),
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
            veteran: {
              type: 'object',
              required: ['isDeceased'],
              properties: pick(veteran.properties, ['isDeceased']),
            },
          },
        },
      },
    };
