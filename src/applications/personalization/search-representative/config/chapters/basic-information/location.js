export const schema = {
  type: 'object',
  title: 'Where would you like to look for an accredited representative?',
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
  city: {
    'ui:title': 'City',
  },
  state: {
    'ui:title': 'State',
  },
  postalCode: {
    'ui:title': 'Postal code',
  },
};
