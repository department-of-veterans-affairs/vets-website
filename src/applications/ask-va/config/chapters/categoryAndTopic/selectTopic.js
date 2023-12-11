import TopicSelect from '../../../components/FormFields/TopicSelect';
import FormElementTitle from '../../../components/FormElementTitle';
import CatAndTopicSummary from '../../../components/CatAndTopicSummary';

const selectTopicPage = {
  uiSchema: {
    'ui:description': form =>
      CatAndTopicSummary({ category: form.formData.selectCategory }),
    selectTopic: {
      'ui:title': FormElementTitle({
        title: 'Which topic best describes your question?',
      }),
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
