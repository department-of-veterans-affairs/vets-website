import get from 'platform/utilities/data/get';
import omit from 'platform/utilities/data/omit';

import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-schema.json';

const { fullName } = fullSchemaPreNeed.definitions;

const nonRequiredFullName = omit('required', fullName);

export const uiSchema = {
  application: {
    veteran: {
      serviceName: {
        first: {
          'ui:required': form =>
            get('application.veteran.view:hasServiceName', form) === true,
        },
        last: {
          'ui:required': form =>
            get('application.veteran.view:hasServiceName', form) === true,
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
        veteran: {
          type: 'object',
          properties: {
            serviceName: nonRequiredFullName,
          },
        },
      },
    },
  },
};
