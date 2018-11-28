import fullSchema from '../config/schema';

const { isVAEmployee } = fullSchema.properties;
export const uiSchema = {
  isVAEmployee: {
    'ui:title': 'Are you currently a VA employee?',
    'ui:widget': 'yesNo',
  },
};

export const schema = {
  type: 'object',
  required: ['isVAEmployee'],
  properties: { isVAEmployee },
};
