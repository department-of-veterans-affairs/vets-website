import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-INTEGRATION-schema.json';

import { serviceRecordsUI } from '../../utils/helpers';

const { veteran } = fullSchemaPreNeed.properties.application.properties;

export const uiSchema = {
  application: {
    veteran: {
      serviceRecords: serviceRecordsUI,
    },
    'ui:options': {
      customTitle: ' ',
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
            serviceRecords: veteran.properties.serviceRecords,
          },
        },
      },
    },
  },
};
