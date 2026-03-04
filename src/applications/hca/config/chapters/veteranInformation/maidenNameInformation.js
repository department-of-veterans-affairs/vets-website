// @ts-check
import {
  titleUI,
  textUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { FULL_SCHEMA } from '../../../utils/imports';
import content from '../../../locales/en/content.json';

const { mothersMaidenName } = FULL_SCHEMA.properties;

export default {
  uiSchema: {
    ...titleUI(content['vet-info--mothers-maiden-name-title']),
    mothersMaidenName: textUI(content['vet-info--mothers-maiden-name-label']),
  },
  schema: {
    type: 'object',
    properties: {
      mothersMaidenName,
    },
  },
};
