import FormElementTitle from '../../../components/FormFields/FormElementTitle';

const yourQuestionPage = {
  uiSchema: {
    'ui:description': FormElementTitle({ title: 'Tell us your question' }),
    question: {
      'ui:title': 'What is your question?',
      'ui:widget': 'textarea',
    },
  },
  schema: {
    type: 'object',
    required: ['question'],
    properties: {
      question: {
        type: 'string',
      },
    },
  },
};

export default yourQuestionPage;
