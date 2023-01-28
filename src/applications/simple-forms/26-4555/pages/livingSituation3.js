import TextareaWidget from 'applications/vaos/components/TextareaWidget';

const livingSituation3 = {
  uiSchema: {
    additionalMedicalInformation: {
      'ui:title':
        'Is there any other medical information that you could tell us that would help you quality for the grant?',
      'ui:widget': TextareaWidget,
    },
  },
  schema: {
    type: 'object',
    properties: {
      additionalMedicalInformation: {
        type: 'string',
      },
    },
  },
};

export default livingSituation3;
