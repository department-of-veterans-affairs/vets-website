import { CHAPTER_1 } from '../../../constants';

const selectSubtopicPage = {
  uiSchema: {
    selectTopic: { 'ui:title': CHAPTER_1.PAGE_3.QUESTION_1 },
  },
  schema: {
    type: 'object',
    required: ['selectSubtopic'],
    properties: {
      selectSubtopic: {
        type: 'string',
      },
    },
  },
};

export default selectSubtopicPage;
