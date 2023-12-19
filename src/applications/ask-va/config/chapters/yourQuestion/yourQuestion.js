import FormElementTitle from '../../../components/FormElementTitle';
import PageFieldSummary from '../../../components/PageFieldSummary';
import { CHAPTER_2 } from '../../../constants';

const yourQuestionPage = {
  uiSchema: {
    'ui:description': FormElementTitle({ title: CHAPTER_2.PAGE_1.TITLE }),
    'ui:objectViewField': PageFieldSummary,
    question: {
      'ui:title': CHAPTER_2.PAGE_1.QUESTION_1,
      'ui:widget': 'textarea',
    },
    reason: {
      'ui:title': CHAPTER_2.PAGE_1.QUESTION_2,
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
