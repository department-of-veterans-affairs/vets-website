import set from 'platform/utilities/data/set';

import {
  CLOSE_REVIEW_CHAPTER,
  OPEN_REVIEW_CHAPTER,
  SET_DATA,
  SET_EDIT_MODE,
  SET_PRE_SUBMIT,
  SET_SUBMISSION,
  SET_SUBMITTED,
  SET_VIEWED_PAGES,
} from '../actions';

import { recalculateSchemaAndData } from '../state/helpers';

export default {
  [OPEN_REVIEW_CHAPTER]: (state, action) => {
    const openChapters = [
      ...state.reviewPageView.openChapters,
      action.openedChapter,
    ];

    return set('reviewPageView.openChapters', openChapters, state);
  },
  [CLOSE_REVIEW_CHAPTER]: (state, action) => {
    const openChapters = state.reviewPageView.openChapters.filter(
      value => value !== action.closedChapter,
    );

    const newState = set('reviewPageView.openChapters', openChapters, state);

    const viewedPages = new Set(state.reviewPageView.viewedPages);

    action.pageKeys.forEach(pageKey => viewedPages.add(pageKey));

    return set('reviewPageView.viewedPages', viewedPages, newState);
  },
  [SET_DATA]: (state, action) => {
    const newState = set('data', action.data, state);
    return recalculateSchemaAndData(newState);
  },
  [SET_EDIT_MODE]: (state, action) => {
    if (state.pages[action.page].showPagePerItem) {
      return set(
        ['pages', action.page, 'editMode', action.index],
        action.edit,
        state,
      );
    }
    return set(['pages', action.page, 'editMode'], action.edit, state);
  },
  [SET_PRE_SUBMIT]: (state, action) => ({
    ...state,
    data: { ...state.data, [action.preSubmitField]: action.preSubmitAccepted },
  }),
  [SET_SUBMISSION]: (state, action) => {
    const newState = set(['submission', action.field], action.value, state);
    if (action.extra) {
      newState.submission.extra = action.extra;
    }

    return newState;
  },
  [SET_SUBMITTED]: (state, action) => {
    const submission = Object.assign({}, state.submission, {
      response: action.response,
      status: 'applicationSubmitted',
    });

    return set('submission', submission, state);
  },
  [SET_VIEWED_PAGES]: (state, action) => {
    const viewedPages = new Set(state.reviewPageView.viewedPages);

    action.pageKeys.forEach(pageKey => viewedPages.add(pageKey));

    return set('reviewPageView.viewedPages', viewedPages, state);
  },
};
