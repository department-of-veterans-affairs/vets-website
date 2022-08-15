import merge from 'lodash/merge';
import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import fullNameUI from 'platform/forms/definitions/fullName';

import ApplicantDescription from '../../../components/FormDescriptions/ApplicantDescription';

const { veteranFullName } = fullSchemaHca.properties;

export default {
  uiSchema: {
    'ui:description': ApplicantDescription,
    veteranFullName: merge({}, fullNameUI, {
      first: {
        'ui:errorMessages': {
          minLength:
            'Please provide a valid name. Must be at least 1 character.',
          pattern: 'Please provide a valid name. Must be at least 1 character.',
        },
      },
      last: {
        'ui:errorMessages': {
          minLength:
            'Please provide a valid name. Must be at least 2 characters.',
          pattern:
            'Please provide a valid name. Must be at least 2 characters.',
        },
      },
    }),
  },
  schema: {
    type: 'object',
    properties: {
      veteranFullName,
    },
  },
};
