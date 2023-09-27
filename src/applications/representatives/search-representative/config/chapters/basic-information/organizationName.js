export const schema = {
  type: 'object',
  title: 'Do you know the name of the organization?',
  properties: {
    organizationName: {
      type: 'string',
    },
  },
};

export const uiSchema = {
  organizationName: {
    'ui:title': 'Organization name',
    'ui:options': {
      hideOnReview: true,
    },
  },
};
