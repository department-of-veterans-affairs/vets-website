import set from 'platform/utilities/data/set';
import { FULL_SCHEMA } from '../../../utils/imports';

const { mothersMaidenName } = FULL_SCHEMA.properties;

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
