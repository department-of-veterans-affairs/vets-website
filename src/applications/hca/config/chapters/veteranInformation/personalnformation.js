import merge from 'lodash/merge';

import applicantDescription from 'platform/forms/components/ApplicantDescription';
import fullNameUI from 'platform/forms/definitions/fullName';
import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';

const { veteranFullName } = fullSchemaHca.properties;

export default {
  uiSchema: {
    'ui:description': applicantDescription,
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
