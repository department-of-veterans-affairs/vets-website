// @ts-check
import {
  titleUI,
  radioUI,
  radioSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { genderLabels } from 'platform/static-data/labels';
import { FULL_SCHEMA } from '../../../utils/imports';
import content from '../../../locales/en/content.json';

const { gender } = FULL_SCHEMA.properties;

// Filter genderLabels to only include values that match the schema enum (F, M only)
const birthSexLabels = {
  F: genderLabels.F,
  M: genderLabels.M,
};

export default {
  uiSchema: {
    ...titleUI(content['vet-info--birth-sex-title']),
    gender: radioUI({
      title: content['vet-info--birth-sex-label'],
      labels: birthSexLabels,
      required: () => true,
    }),
  },
  schema: {
    type: 'object',
    required: ['gender'],
    properties: {
      gender: radioSchema(gender.enum),
    },
  },
};
