import fullSchema10282 from 'vets-json-schema/dist/22-10282-schema.json';
import { titleUI } from 'platform/forms-system/src/js/web-component-patterns';
import { VaRadioField } from '@department-of-veterans-affairs/platform-forms-system/web-component-fields';

const uiSchema = {
  ...titleUI('Your current annual salary'),
  currentAnnualSalary: {
    'ui:title': 'What’s your current annual salary?',
    'ui:webComponentField': VaRadioField,
  },
};

const schema = {
  type: 'object',
  properties: {
    currentAnnualSalary: { ...fullSchema10282.properties.currentAnnualSalary },
  },
};

export { uiSchema, schema };
