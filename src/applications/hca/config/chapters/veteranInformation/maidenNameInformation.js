// @ts-check
import {
  titleUI,
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import content from '../../../locales/en/content.json';

export default {
  uiSchema: {
    ...titleUI(content['vet-info--mothers-maiden-name-title']),
    mothersMaidenName: textUI(content['vet-info--mothers-maiden-name-label']),
  },
  schema: {
    type: 'object',
    properties: {
      mothersMaidenName: {
        ...textSchema,
        maxLength: 35,
      },
    },
  },
};
