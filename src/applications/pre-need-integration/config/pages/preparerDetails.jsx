import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-INTEGRATION-schema.json';

import { isAuthorizedAgent } from '../../utils/helpers';
import {
  PreparerDescription,
  PreparerDetailsTitle,
} from '../../components/PreparerHelpers';

const { applicant } = fullSchemaPreNeed.properties.application.properties;

export const uiSchema = {
  'ui:title': PreparerDetailsTitle,
  'ui:description': PreparerDescription,
  application: {
    applicant: {
      name: {
        first: {
          'ui:title': 'Your first name',
          'ui:required': isAuthorizedAgent,
        },
        middle: {
          'ui:options': {
            hideIf: () => true,
          },
        },
        last: {
          'ui:title': 'Your last name',
          'ui:required': isAuthorizedAgent,
        },
        suffix: {
          'ui:options': {
            hideIf: () => true,
          },
        },
      },
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    application: {
      type: 'object',
      properties: {
        applicant: {
          type: 'object',
          properties: {
            name: applicant.properties.name,
          },
        },
      },
    },
  },
};
