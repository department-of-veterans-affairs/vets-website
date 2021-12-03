export const personalInformationFormSchema = {
  type: 'object',
  properties: {
    preferredName: {
      type: 'string',
      pattern: '/[a-zA-Z]*/g',
      // TODO: need maxLength
    },
    pronouns: {
      type: 'string',
      // TODO: Needs enum and enums
    },
    genderIdentity: {
      type: 'string',
      // TODO: Needs enum and enums
    },
    sexualOrientation: {
      type: 'string',
      // TODO: Needs enum and enums
    },
  },
  required: [''], // TODO: WHAT IS REQUIRED?
};

// TODO: NEED TO BUILD OUT UI
export const personalInformationUiSchema = {
  inputPhoneNumber: {
    'ui:title': `(U.S. numbers only)`,
    'ui:errorMessages': {
      pattern: 'Please enter a valid 10-digit U.S. phone number.',
    },
  },
  extension: {
    'ui:title': 'Extension',
    'ui:errorMessages': {
      pattern: 'Please enter a valid extension.',
    },
  },
};
