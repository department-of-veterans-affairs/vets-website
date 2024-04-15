import TopicSelect from '../../../components/FormFields/TopicSelect';
import FormElementTitle from '../../../components/FormElementTitle';
import CatAndTopicSummary from '../../../components/CatAndTopicSummary';
import PageFieldSummary from '../../../components/PageFieldSummary';
import { CHAPTER_1 } from '../../../constants';

const selectTopicPage = {
  uiSchema: {
    'ui:title': form =>
      CatAndTopicSummary({ category: form.formData.selectCategory }),
    'ui:description': FormElementTitle({
      title: CHAPTER_1.PAGE_2.PAGE_DESCRIPTION,
    }),
    'ui:objectViewField': PageFieldSummary,
    selectTopic: {
      'ui:title': CHAPTER_1.PAGE_2.QUESTION_1,
      'ui:widget': TopicSelect,
    },
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
