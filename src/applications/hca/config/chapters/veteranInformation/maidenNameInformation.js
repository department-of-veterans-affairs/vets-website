import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import set from 'platform/utilities/data/set';
import { FULL_SCHEMA } from '../../../utils/imports';
import content from '../../../locales/en/content.json';

const { mothersMaidenName } = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    ...titleUI(content['vet-info--mothers-maiden-name-title']),
    mothersMaidenName: {
      'ui:title': content['vet-info--mothers-maiden-name-label'],
    },
  },
  schema: {
    type: 'object',
    properties: {
      mothersMaidenName: set('maxLength', 35, mothersMaidenName),
    },
  },
};
