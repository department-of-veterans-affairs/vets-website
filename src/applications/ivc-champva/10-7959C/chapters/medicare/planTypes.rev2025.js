import {
  radioSchema,
  radioUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { titleWithNameUI } from '../../utils/titles';
import content from '../../locales/en/content.json';

const TITLE_TEXT = content['medicare--plan-type-title'];
const INPUT_LABEL = content['medicare--plan-type-label'];

const SCHEMA_LABELS = {
  ab: content['medicare--plan-type-option--ab'],
  c: content['medicare--plan-type-option--c'],
  a: content['medicare--plan-type-option--a'],
  b: content['medicare--plan-type-option--b'],
};
const SCHEMA_ENUM = Object.keys(SCHEMA_LABELS);

export default {
  uiSchema: {
    ...titleWithNameUI(TITLE_TEXT),
    medicarePlanType: radioUI({
      title: INPUT_LABEL,
      labels: SCHEMA_LABELS,
      updateSchema: formData => {
        const schemaEnum = formData['view:applicantAgeOver65']
          ? SCHEMA_ENUM
          : SCHEMA_ENUM.slice(0, -1);
        return { enum: schemaEnum };
      },
    }),
  },
  schema: {
    type: 'object',
    required: ['medicarePlanType'],
    properties: {
      medicarePlanType: radioSchema(SCHEMA_ENUM),
    },
  },
};
