import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-INTEGRATION-schema.json';
import set from 'platform/utilities/data/set';
import * as autosuggest from 'platform/forms-system/src/js/definitions/autosuggest';

import { selfServiceRecordsUI } from '../../utils/helpers';

// const { veteran } = fullSchemaPreNeed.properties.application.properties;
const {
  serviceRecords,
} = fullSchemaPreNeed.properties.application.properties.veteran.properties;

function currentlyServiceRecordsMinItem() {
  const copy = { ...serviceRecords };
  copy.minItems = 1;
  return set('items.properties.serviceBranch', autosuggest.schema, copy);
}

export const uiSchema = {
  application: {
    veteran: {
      serviceRecords: selfServiceRecordsUI,
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
            serviceRecords: currentlyServiceRecordsMinItem(),
            // serviceRecords: veteran.properties.serviceRecords,
          },
          serviceRecords,
        },
      },
    },
  },
};
