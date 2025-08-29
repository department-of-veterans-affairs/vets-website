import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-INTEGRATION-schema.json';

import VaTextInputField from 'platform/forms-system/src/js/web-component-fields/VaTextInputField';

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
          'ui:webComponentField': VaTextInputField,
          'ui:required': isAuthorizedAgent,
        },
        middle: {
          'ui:webComponentField': VaTextInputField,
          'ui:options': {
            hideIf: () => true,
          },
        },
        last: {
          'ui:title': 'Your last name',
          'ui:webComponentField': VaTextInputField,
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
  'ui:options': {
    itemName: 'Your Details',
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
