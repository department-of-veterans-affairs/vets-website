import SubtopicSelect from '../../../components/FormFields/SubtopicSelect';
import FormElementTitle from '../../../components/FormElementTitle';

const selectSubtopicPage = {
  uiSchema: {
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
