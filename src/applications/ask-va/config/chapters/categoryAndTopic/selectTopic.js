import { CHAPTER_1 } from '../../../constants';

const selectTopicPage = {
  uiSchema: {
    selectTopic: { 'ui:title': CHAPTER_1.PAGE_2.QUESTION_1 },
  },
  schema: {
    type: 'object',
    required: ['selectTopic'],
    properties: {
      selectTopic: {
        type: 'string',
      },
    },
  },
};

export default selectTopicPage;
