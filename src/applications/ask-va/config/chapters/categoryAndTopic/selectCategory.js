import { CHAPTER_1 } from '../../../constants';

const selectCategoryPage = {
  uiSchema: {
    selectCategory: { 'ui:title': CHAPTER_1.PAGE_1.QUESTION_1 },
  },
  schema: {
    type: 'object',
    required: ['selectCategory'],
    properties: {
      selectCategory: {
        type: 'string',
      },
    },
  },
};

export default selectCategoryPage;
