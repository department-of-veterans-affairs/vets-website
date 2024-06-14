import CategorySelect from '../../../components/FormFields/CategorySelect';
import FormElementTitle from '../../../components/FormElementTitle';
import PageFieldSummary from '../../../components/PageFieldSummary';
import { CHAPTER_1 } from '../../../constants';

const selectCategoryPage = {
  uiSchema: {
    'ui:title': FormElementTitle({
      title: CHAPTER_1.PAGE_1.PAGE_DESCRIPTION,
    }),
    'ui:objectViewField': PageFieldSummary,
    selectCategory: {
      'ui:title': CHAPTER_1.PAGE_1.QUESTION_1,
      'ui:widget': CategorySelect,
    },
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
