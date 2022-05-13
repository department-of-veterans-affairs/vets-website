import { status } from '../../utilities';

export const schema = {
  type: 'object',
  properties: {
    status,
  },
};

export const uiSchema = {
  status: {
    'ui:title': 'Let us know which of these best describes you:',
    'ui:widget': 'radio',
    'ui:required': () => true,
    'ui:options': {
      updateSchema: (formData, statusSchema) => {
        return {
          type: 'string',
          enum: statusSchema.enum,
          enumNames: [
            'I’m an active-duty service member',
            'I’m a Veteran',
            'I’m a dependent spouse',
            'I’m a dependent child',
          ],
        };
      },
    },
  },
};
