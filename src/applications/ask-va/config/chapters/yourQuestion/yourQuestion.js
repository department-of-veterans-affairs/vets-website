import FormElementTitle from '../../../components/FormElementTitle';

const yourQuestionPage = {
  uiSchema: {
    'ui:description': FormElementTitle({ title: 'Tell us your question' }),
    question: {
      'ui:title': 'What is your question?',
      'ui:widget': 'textarea',
    },
    reason: {
      'ui:title': `Tell us the reason you're contacting us:`,
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          compliment: 'Compliment',
          question: 'Question',
          serviceComplaint: 'Service Complaint',
          suggestion: 'Suggestion',
          townHall: 'Town Hall',
          other: 'Other',
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: ['question'],
    properties: {
      question: {
        type: 'string',
      },
      reason: {
        type: 'string',
        enum: [
          'compliment',
          'question',
          'serviceComplaint',
          'suggestion',
          'townHall',
          'other',
        ],
      },
    },
  },
};

export default yourQuestionPage;
