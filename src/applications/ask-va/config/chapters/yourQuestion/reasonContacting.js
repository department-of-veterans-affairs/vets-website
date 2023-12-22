import FormElementTitle from '../../../components/FormElementTitle';
import { CHAPTER_2 } from '../../../constants';
import { radioUI } from '../../schema-helpers/radioHelper';

const reasonContactPage = {
  uiSchema: {
    'ui:description': FormElementTitle({ title: CHAPTER_2.PAGE_2.TITLE }),
    question: {
      personalRelationship: radioUI({
        title: CHAPTER_2.PAGE_2.QUESTION_1,
      }),
      labels: {
        question: 'I have a question',
        nice: 'I want to say something nice',
        complaint: 'I have a complaint about a service',
        suggestion: 'I have a suggestion',
        townHall: 'I attended a Town Hall and now I have a question',
        somethingElse: 'I want to say something else',
      },
      // 'ui:title': CHAPTER_2.PAGE_2.QUESTION_1,
      // 'ui:widget': 'radio',
      // 'ui:options': {
      //   labels: {
      //     question: 'I have a question',
      //     nice: 'I want to say something nice',
      //     complaint: 'I have a complaint about a service',
      //     suggestion: 'I have a suggestion',
      //     townHall: 'I attended a Town Hall and now I have a question',
      //     somethingElse: 'I want to say something else',
      //   },
      // },
    },
  },
  schema: {
    type: 'object',
    required: [],
    properties: {
      // question: radioSchema(Object.keys( {
      //   question: 'I have a question',
      //   nice: 'I want to say something nice',
      //   complaint: 'I have a complaint about a service',
      //   suggestion: 'I have a suggestion',
      //   townHall: 'I attended a Town Hall and now I have a question',
      //   somethingElse: 'I want to say something else')})
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
