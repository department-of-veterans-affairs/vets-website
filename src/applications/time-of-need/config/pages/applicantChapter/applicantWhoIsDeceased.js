/** @type {PageSchema} */
const applicantWhoIsDeceased = {
  uiSchema: {
    deceasedType: {
      'ui:title': 'Who is the deceased?',
      'ui:widget': 'radio',
    },
  },
  schema: {
    type: 'object',
    properties: {
      deceasedType: {
        type: 'string',
        enum: ['veteran', 'spouse', 'dependentChild'],
        enumNames: [
          'A Veteran',
          'The spouse of a Veteran',
          'The dependent child of a Veteran',
        ],
      },
    },
    required: ['deceasedType'],
  },
};

export default applicantWhoIsDeceased;
