import TopicList from '../../../components/FormFields/TopicList';
import FormElementTitle from '../../../components/FormFields/FormElementTitle';

const selectCategoryPage = {
  uiSchema: {
    selectCategory: {
      'ui:title': FormElementTitle({
        title: 'Which category best describes your question?',
      }),
      'ui:widget': TopicList,
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
