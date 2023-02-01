import TextareaWidget from '../widgets/TextareaWidget';

const livingSituation3 = {
  uiSchema: {
    otherMedicalInformation: {
      'ui:title':
        'Is there any other medical information that you could tell us that would help you quality for the grant?',
      'ui:widget': TextareaWidget,
      'ui:options': {
        rows: 5,
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      otherMedicalInformation: {
        type: 'string',
      },
    },
  },
};

export default livingSituation3;
