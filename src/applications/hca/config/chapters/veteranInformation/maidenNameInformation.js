import set from 'platform/utilities/data/set';
import fullSchemaHca from 'vets-json-schema/dist/10-10EZ-schema.json';

const { mothersMaidenName } = fullSchemaHca.properties;

export default {
  uiSchema: {
    mothersMaidenName: {
      'ui:title': 'Mother\u2019s maiden name',
    },
  },
  schema: {
    type: 'object',
    properties: {
      mothersMaidenName: set('maxLength', 35, mothersMaidenName),
    },
  },
};
