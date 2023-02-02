import TextareaWidget from '../widgets/TextareaWidget';

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
    properties: {
      remarks: {
        type: 'string',
      },
    },
  },
};

export default remarks;
