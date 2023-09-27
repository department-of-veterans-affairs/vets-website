import TopicList from '../../../components/FormFields/TopicList';
import FormElementTitle from '../../../components/FormFields/FormElementTitle';

const selectTopicPage = {
  uiSchema: {
    selectTopic: {
      'ui:title': FormElementTitle({
        title: 'Which topic best describes your question?',
      }),
      'ui:widget': TopicList,
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
