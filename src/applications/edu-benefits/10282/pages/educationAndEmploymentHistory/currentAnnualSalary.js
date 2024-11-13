import fullSchema10282 from 'vets-json-schema/dist/22-10282-schema.json';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';

const uiSchema = {
  ...titleUI('Salary'),
  currentAnnualSalary: {
    'ui:title': 'What’s your current annual salary?',
    'ui:widget': 'radio',
  },
};

const schema = {
  type: 'object',
  properties: {
    currentAnnualSalary: { ...fullSchema10282.properties.currentAnnualSalary },
  },
};

export { uiSchema, schema };
