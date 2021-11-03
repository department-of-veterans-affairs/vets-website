export const schema = {
  type: 'object',
  required: ['state'],
  properties: {
    city: {
      type: 'string',
    },
    state: {
      type: 'string',
    },
    postalCode: {
      type: 'string',
    },
  },
};

export const uiSchema = {
  'ui:title': 'Where are you looking?',
  city: {
    'ui:title': 'City',
  },
  state: {
    'ui:title': 'State',
  },
  postalCode: {
    'ui:title': 'Postal Code',
  },
};
