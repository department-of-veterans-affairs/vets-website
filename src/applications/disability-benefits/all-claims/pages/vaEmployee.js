import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

const { isVaEmployee } = fullSchema.properties;
export const uiSchema = {
  isVaEmployee: {
    'ui:title': 'Are you currently a VA employee?',
    'ui:widget': 'yesNo',
  },
};

export const schema = {
  type: 'object',
  required: ['isVaEmployee'],
  properties: { isVaEmployee },
};
