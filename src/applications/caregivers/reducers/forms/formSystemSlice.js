import { createSlice } from '@reduxjs/toolkit';
import { recalculateSchemaAndData } from 'platform/forms-system/src/js/state/helpers';
import set from 'platform/utilities/data/set';

const formsSystemSlice = createSlice({
  name: 'formsSystem',
  initialState: {},
  reducers: {
    closeReviewChapter(state, action) {
      const { closedChapter, pageKeys } = action.payload;
      const openChapters = {
        ...state.reviewPageView.openChapters,
        [closedChapter]: false,
      };
      const newState = set('reviewPageView.openChapters', openChapters, state);
      const viewedPages = new Set(state.reviewPageView.viewedPages);
      pageKeys.forEach(key => viewedPages.add(key));
      return set('reviewPageView.viewedPages', [...viewedPages], newState);
    },
    openReviewChapter(state, action) {
      const { openChapter } = action.payload;
      const openChapters = {
        ...state.reviewPageView.openChapters,
        [openChapter]: true,
      };
      return set('reviewPageView.openChapters', openChapters, state);
    },
    setData(state, action) {
      const { data } = action.payload;
      const newState = set('data', data, state);
      return recalculateSchemaAndData(newState);
    },
    setEditMode(state, action) {
      const { edit, index, page } = action.payload;
      return state.pages[page].showPagePerItem
        ? set(['pages', page, 'editMode', index], edit, state)
        : set(['pages', page, 'editMode'], edit, state);
    },
    setFormErrors(state, action) {
      const { data = {} } = action.payload;
      return { ...state, formErrors: data };
    },
    setPreSubmit(state, action) {
      const { preSubmitAccepted, preSubmitField } = action.payload;
      const dataToSet = { ...state.data, [preSubmitField]: preSubmitAccepted };
      return { ...state, data: dataToSet };
    },
    setSubmission(state, action) {
      const { errorMessage, extra, field, value } = action.payload;
      const newState = set(['submission', field], value, state);
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
    setSubmitted(state, action) {
      const { response } = action.payload;
      const submission = {
        ...state.submission,
        status: 'applicationSubmitted',
        timestamp: new Date(),
        response,
      };
      return set('submission', submission, state);
    },
    setViewedPages(state, action) {
      const { pageKeys } = action.payload;
      const viewedPages = new Set(state.reviewPageView.viewedPages);
      pageKeys.forEach(key => viewedPages.add(key));
      return set('reviewPageView.viewedPages', [...viewedPages], state);
    },
  },
});

export const {
  closeReviewChapter,
  openReviewChapter,
  setData,
  setEditMode,
  setFormErrors,
  setPreSubmit,
  setSubmission,
  setSubmitted,
  setViewedPages,
} = formsSystemSlice.actions;
export default formsSystemSlice.reducer;
