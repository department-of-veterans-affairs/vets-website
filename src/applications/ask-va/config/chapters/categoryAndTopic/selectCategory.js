import React from 'react';
import CategorySelect from '../../../components/FormFields/CategorySelect';
import PageFieldSummary from '../../../components/PageFieldSummary';
import SignInMayBeRequiredCategoryPage from '../../../components/SignInMayBeRequiredCategoryPage';
import { CHAPTER_1 } from '../../../constants';

const selectCategoryPage = {
  uiSchema: {
    'ui:title': SignInMayBeRequiredCategoryPage,
    'ui:description': <h3>{CHAPTER_1.PAGE_1.TITLE}</h3>,
    'ui:objectViewField': PageFieldSummary,
    selectCategory: {
      'ui:title': CHAPTER_1.PAGE_1.QUESTION_1,
      'ui:widget': CategorySelect,
      'ui:options': {
        required: () => true,
        keepInPageOnReview: true,
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
