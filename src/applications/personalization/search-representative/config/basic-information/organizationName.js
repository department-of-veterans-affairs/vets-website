export const schema = {
  type: 'object',
  properties: {
    organizationName: {
      type: 'string',
    },
    lastNameOfPerson: {
      type: 'string',
    },
    firstNameOfPerson: {
      type: 'string',
    },
  },
};

export const uiSchema = {
  organizationName: {
    'ui:title': 'Organization name',
  },
  lastNameOfPerson: {
    'ui:title': 'Last name of person',
  },
  firstNameOfPerson: {
    'ui:title': 'First name of person',
  },
};
