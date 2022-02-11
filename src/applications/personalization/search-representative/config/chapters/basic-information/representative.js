export const schema = {
  type: 'object',
  title: 'Do you know the name of the accredited representative?',
  properties: {
    lastNameOfRepresentative: {
      type: 'string',
    },
    firstNameOfRepresentative: {
      type: 'string',
    },
  },
};

export const uiSchema = {
  lastNameOfRepresentative: {
    'ui:title': 'Last name of accredited representative',
    'ui:options': {
      hideOnReview: true,
    },
  },
  firstNameOfRepresentative: {
    'ui:title': 'First name of accredited representative',
    'ui:options': {
      hideOnReview: true,
    },
  },
};
