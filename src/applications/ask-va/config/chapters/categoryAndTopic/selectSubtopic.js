import SubtopicSelect from '../../../components/FormFields/SubtopicSelect';
import FormElementTitle from '../../../components/FormElementTitle';
import CatAndTopicSummary from '../../../components/CatAndTopicSummary';

const selectSubtopicPage = {
  uiSchema: {
    'ui:description': form =>
      CatAndTopicSummary({
        category: form.formData.selectCategory,
        topic: form.formData.selectTopic,
      }),
    selectSubtopic: {
      'ui:title': FormElementTitle({
        title: 'Which subtopic best describes your question?',
      }),
      'ui:widget': SubtopicSelect,
    },
  },
  schema: {
    type: 'object',
    required: ['selectTopic'],
    properties: {
      selectSubtopic: {
        type: 'string',
      },
    },
  },
};

export default selectSubtopicPage;
