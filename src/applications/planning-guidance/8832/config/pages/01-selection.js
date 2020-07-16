export const schema = {
  type: 'object',
  properties: {
    applicantType: {
      type: 'string',
      title: 'Select one of the option below',
      enum: [
        'Active duty service member',
        'Veteran',
        'Spouse of a veteran or service member',
        'Child of a veteran or service member',
      ],
    },
  },
};

export const uiSchema = {
  applicantType: {
    'ui:widget': 'radio',
  },
};
