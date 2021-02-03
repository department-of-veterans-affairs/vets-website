import { merge, set } from 'lodash/fp';

import applicantDescription from 'platform/forms/components/ApplicantDescription';
import fullNameUI from 'platform/forms/definitions/fullName';
import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';

const { mothersMaidenName, veteranFullName } = fullSchemaHca.properties;

export default {
  uiSchema: {
    'ui:description': applicantDescription,
    veteranFullName: merge(fullNameUI, {
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
    mothersMaidenName: {
      'ui:title': 'Mother\u2019s maiden name',
    },
  },
  schema: {
    type: 'object',
    properties: {
      veteranFullName,
      mothersMaidenName: set('maxLength', 35, mothersMaidenName),
    },
  },
};
