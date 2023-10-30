import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import { radioUI } from 'platform/forms-system/src/js/web-component-patterns';
import { genderLabels } from 'platform/static-data/labels';
import content from '../../../locales/en/content.json';

const { gender } = ezrSchema.properties;

export default {
  uiSchema: {
    gender: radioUI({
      title: content['vet-birth-sex-title'],
      labels: genderLabels,
    }),
  },
  schema: {
    type: 'object',
    required: ['gender'],
    properties: { gender },
  },
};
