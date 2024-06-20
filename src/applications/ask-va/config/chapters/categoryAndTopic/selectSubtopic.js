import SubtopicSelect from '../../../components/FormFields/SubtopicSelect';
import FormElementTitle from '../../../components/FormElementTitle';
import CatAndTopicSummary from '../../../components/CatAndTopicSummary';
import PageFieldSummary from '../../../components/PageFieldSummary';
import { CHAPTER_1 } from '../../../constants';

const selectSubtopicPage = {
  uiSchema: {
    'ui:title': form =>
      CatAndTopicSummary({
        category: form.formData.selectCategory,
        topic: form.formData.selectTopic,
      }),
    'ui:description': FormElementTitle({
      title: CHAPTER_1.PAGE_3.PAGE_DESCRIPTION,
    }),
    'ui:objectViewField': PageFieldSummary,
    selectSubtopic: {
      'ui:title': CHAPTER_1.PAGE_3.QUESTION_1,
      'ui:widget': SubtopicSelect,
    },
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
