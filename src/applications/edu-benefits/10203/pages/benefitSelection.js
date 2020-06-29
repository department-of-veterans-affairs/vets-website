import fullSchema from 'vets-json-schema/dist/22-10203-schema.json';
import { benefitsLabels, ineligibleAlert } from './../content/benefitSelection';
import { validateBooleanGroup } from 'platform/forms-system/src/js/validation';
import { displayIneligibleAlert } from '../helpers';

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
    'ui:title': 'Which benefit have you used or are currently using?',
    'ui:validations': [validateBooleanGroup],
    'ui:errorMessages': {
      atLeastOne: 'Please select at least one',
    },
    'ui:options': {
      showFieldLabel: true,
    },
    ...uiSchemaCheckboxes(),
  },
  'view:ineligibleAlert': {
    'ui:description': ineligibleAlert,
    'ui:options': {
      hideIf: displayIneligibleAlert,
    },
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
    'view:ineligibleAlert': {
      type: 'object',
      properties: {},
    },
  },
};
