import FormElementTitle from '../../../components/FormElementTitle';
import CategorySelect from '../../../components/FormFields/CategorySelect';
import PageFieldSummary from '../../../components/PageFieldSummary';
// import SignInMayBeRequiredCategoryPage from '../../../components/SignInMayBeRequiredCategoryPage';
import { CHAPTER_1 } from '../../../constants';

const selectCategoryPage = {
  uiSchema: {
    // 'ui:title': SignInMayBeRequiredCategoryPage,
    'ui:description': FormElementTitle({
      title: CHAPTER_1.PAGE_1.PAGE_DESCRIPTION,
    }),
    'ui:objectViewField': PageFieldSummary,
    selectCategory: {
      'ui:title': CHAPTER_1.PAGE_1.QUESTION_1,
      'ui:widget': CategorySelect,
      'ui:errorMessages': {
        required: 'Please select a category',
      },
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
