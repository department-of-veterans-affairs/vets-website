import set from '../../../../utilities/data/set';

import {
  CLOSE_REVIEW_CHAPTER,
  OPEN_REVIEW_CHAPTER,
  TOGGLE_ALL_REVIEW_CHAPTERS,
  SET_DATA,
  SET_EDIT_MODE,
  SET_PRE_SUBMIT,
  SET_SUBMISSION,
  SET_SUBMITTED,
  SET_VIEWED_PAGES,
  SET_FORM_ERRORS,
  SET_ITF,
} from '../actions';

import { recalculateSchemaAndData } from './helpers';

export default {
  [OPEN_REVIEW_CHAPTER]: (state, action) => {
    const openChapters = {
      ...state.reviewPageView.openChapters,
      [action.openedChapter]: true,
    };

    return set('reviewPageView.openChapters', openChapters, state);
  },
  [CLOSE_REVIEW_CHAPTER]: (state, action) => {
    const openChapters = {
      ...state.reviewPageView.openChapters,
      [action.closedChapter]: false,
    };

    const newState = set('reviewPageView.openChapters', openChapters, state);

    const viewedPages = new Set(state.reviewPageView.viewedPages);

    action.pageKeys.forEach(pageKey => viewedPages.add(pageKey));

    return set('reviewPageView.viewedPages', viewedPages, newState);
  },
  [TOGGLE_ALL_REVIEW_CHAPTERS]: (state, action) => {
    return set('reviewPageView.openChapters', action.chapters, state);
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
    const { extra, errorMessage } = action;
    const submission = {
      ...newState.submission,
      timestamp: new Date().getTime(),
      hasAttemptedSubmit: true,
    };
    if (errorMessage) {
      submission.errorMessage = errorMessage;
    }
    if (extra) {
      submission.extra = extra;
    }
    newState.submission = submission;
    return newState;
  },
  [SET_SUBMITTED]: (state, action) => {
    const now = new Date();
    const submission = {
      ...state.submission,
      response: action.response,
      status: 'applicationSubmitted',
      timestamp: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
        2,
        '0',
      )}-${String(now.getDate()).padStart(2, '0')}`,
    };
    return set('submission', submission, state);
  },
  [SET_VIEWED_PAGES]: (state, action) => {
    const viewedPages = new Set(state.reviewPageView.viewedPages);

    action.pageKeys.forEach(pageKey => viewedPages.add(pageKey));

    return set('reviewPageView.viewedPages', viewedPages, state);
  },
  [SET_FORM_ERRORS]: (state, { data = {} }) => ({
    ...state,
    // See platform/forms-system/src/js/utilities/data/reduceErrors.js for
    // data structure
    formErrors: data,
  }),
  // Intent to File data
  [SET_ITF]: (state, { data = {} }) => ({
    ...state,
    itf: data,
  }),
};
