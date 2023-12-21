import FormElementTitle from '../../../components/FormElementTitle';
import PageFieldSummary from '../../../components/PageFieldSummary';
import { CHAPTER_2 } from '../../../constants';

const reasonContactPage = {
  uiSchema: {
    'ui:description': FormElementTitle({ title: CHAPTER_2.PAGE_2.TITLE }),
    'ui:objectViewField': PageFieldSummary,
    question: {
      'ui:title': CHAPTER_2.PAGE_2.QUESTION_1,
      'ui:widget': 'radio',
      'ui:options': {
        labels: {
          question: 'I have a question',
          nice: 'I want to say something nice',
          complaint: 'I have a complaint about a service',
          suggestion: 'I have a suggestion',
          townHall: 'I attended a Town Hall and now I have a question',
          somethingElse: 'I want to say something else',
        },
      },
    },
  },
  schema: {
    type: 'object',
    required: [],
    properties: {
      question: {
        type: 'string',
        enum: [
          'question',
          'nice',
          'complaint',
          'suggestion',
          'townHall',
          'somethingElse',
        ],
      },
    },
  },
};

export default reasonContactPage;
