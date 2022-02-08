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
    'ui:options': {
      hideOnReview: true,
    },
  },
  state: {
    'ui:title': 'State',
    'ui:options': {
      hideOnReview: true,
    },
  },
  postalCode: {
    'ui:title': 'Postal code',
    'ui:options': {
      hideOnReview: true,
    },
  },
};
