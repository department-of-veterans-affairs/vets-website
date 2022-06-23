import merge from 'lodash/merge';

import fullNameUI from 'platform/forms/definitions/fullName';
import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';
import HCAApplicantDescription from 'applications/hca/components/HCAApplicantDescription';

const { veteranFullName } = fullSchemaHca.properties;

export default {
  uiSchema: {
    'ui:description': HCAApplicantDescription,
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
