import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import fullSchema10282 from 'vets-json-schema/dist/22-10282-schema.json';

const uiSchema = {
  ...titleUI('Your main area of focus'),
  techIndustryFocusArea: {
    'ui:title': 'What’s your main area of focus in the technology industry?',
    'ui:widget': 'radio',
  },
};

const schema = {
  type: 'object',
  properties: {
    techIndustryFocusArea: {
      ...fullSchema10282.properties.techIndustryFocusArea,
      enum: fullSchema10282.properties.techIndustryFocusArea.enum.sort(),
    },
  },
};

export { uiSchema, schema };
