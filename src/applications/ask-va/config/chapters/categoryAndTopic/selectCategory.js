import CategorySelect from '../../../components/FormFields/CategorySelect';
import FormElementTitle from '../../../components/FormElementTitle';

const selectCategoryPage = {
  uiSchema: {
    selectCategory: {
      'ui:title': FormElementTitle({
        title: 'Which category best describes your question?',
      }),
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
