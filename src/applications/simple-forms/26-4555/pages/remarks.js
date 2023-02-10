import TextareaWidget from '../widgets/TextareaWidget';

// we're not using constants-fullSchema imports and related patterns here
// remarks is a top-level field in the schema -- no required or properties keys
const remarks = {
  uiSchema: {
    remarks: {
      'ui:title':
        'Is there any other medical information that you could tell us that would help you qualify for the grant?',
      'ui:widget': TextareaWidget,
      'ui:options': {
        rows: 8,
      },
    },
  },
  schema: {
    type: 'object',
    required: [],
    properties: {
      remarks: {
        type: 'string',
      },
    },
  },
};

export default remarks;
