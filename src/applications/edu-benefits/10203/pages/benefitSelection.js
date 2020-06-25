import fullSchema from 'vets-json-schema/dist/22-1995-schema.json';
import { benefitsLabels } from './../content/benefitSelection';

const { benefit } = fullSchema.properties;

const displayBenefit = {
  ...benefit,
  enum: [...benefit.enum],
};

displayBenefit.enum.splice(1, 0, 'fryScholarship');
const uiSchemaCheckboxes = () => {
  const uiSchemaCheckbox = {};
  Object.keys(benefitsLabels).forEach(key => {
    uiSchemaCheckbox[key] = { 'ui:title': benefitsLabels[key] };
  });
  return uiSchemaCheckbox;
};
const schemaCheckboxes = () => {
  const schemaCheckbox = {};
  Object.keys(benefitsLabels).forEach(key => {
    schemaCheckbox[key] = { type: 'boolean' };
  });
  return schemaCheckbox;
};

export const uiSchema = {
  'view:benefit': {
    'ui:title':
      'Which benefit are you currently using or have you used most recently?',
    ...uiSchemaCheckboxes(),
  },
};

export const schema = {
  type: 'object',
  required: ['view:benefit'],
  properties: {
    'view:benefit': {
      type: 'object',
      properties: {
        ...schemaCheckboxes(),
      },
    },
  },
};
