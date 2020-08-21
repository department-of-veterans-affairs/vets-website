export const schema = {
  type: 'object',
  properties: {
    status: {
      type: 'string',
      enum: ['isActiveDuty', 'isVeteran', 'isSpouse', 'isChild'],
      enumNames: [
        'Active duty service member',
        'Veteran',
        'Spouse of a Veteran or service member',
        'Child of a Veteran or service member',
      ],
    },
  },
};

export const uiSchema = {
  status: {
    'ui:title': 'Select one of the options below.',
    'ui:widget': 'radio',
  },
};
