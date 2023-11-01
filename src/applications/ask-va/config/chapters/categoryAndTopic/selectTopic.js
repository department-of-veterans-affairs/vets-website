import TopicSelect from '../../../components/FormFields/TopicSelect';
import FormElementTitle from '../../../components/FormElementTitle';

const selectTopicPage = {
  uiSchema: {
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
