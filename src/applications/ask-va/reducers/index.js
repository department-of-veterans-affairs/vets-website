import { createSaveInProgressFormReducer } from '@department-of-veterans-affairs/platform-forms/reducers';
import set from '@department-of-veterans-affairs/platform-forms-system/set';
import formConfig from '../config/form';

import {
  SET_CATEGORY_ID,
  SET_TOPIC_ID,
  SET_UPDATED_IN_REVIEW,
  CLOSE_REVIEW_CHAPTER,
  OPEN_REVIEW_CHAPTER,
} from '../actions';

const initialState = {
  categoryID: '',
  topicID: '',
  updatedInReview: '',
  reviewPageView: {
    openChapters: [],
  },
};

export default {
  form: createSaveInProgressFormReducer(formConfig),
  askVA: (state = initialState, action) => {
    switch (action.type) {
      case SET_CATEGORY_ID:
        return {
          ...state,
          categoryID: action.payload,
        };
      case SET_TOPIC_ID:
        return {
          ...state,
          topicID: action.payload,
        };
      case SET_UPDATED_IN_REVIEW:
        return {
          ...state,
          updatedInReview: action.payload,
        };
      case OPEN_REVIEW_CHAPTER: {
        const openChapters = [
          ...state.reviewPageView.openChapters,
          action.openedChapter,
        ];

        return set('reviewPageView.openChapters', openChapters, state);
      }
      case CLOSE_REVIEW_CHAPTER: {
        const openChapters = state.reviewPageView.openChapters.filter(
          value => value !== action.closedChapter,
        );

        const newState = set(
          'reviewPageView.openChapters',
          openChapters,
          state,
        );

        const viewedPages = new Set(state.reviewPageView.viewedPages);

        action.pageKeys.forEach(pageKey => viewedPages.add(pageKey));

        return set('reviewPageView.viewedPages', viewedPages, newState);
      }
      default:
        return state;
    }
  },
};
