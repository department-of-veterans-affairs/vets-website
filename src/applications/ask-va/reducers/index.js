import set from '@department-of-veterans-affairs/platform-forms-system/set';
import { createSaveInProgressFormReducer } from '@department-of-veterans-affairs/platform-forms/reducers';
import formConfig from '../config/form';

import {
  CLEAR_FORM_DATA,
  CLOSE_REVIEW_CHAPTER,
  OPEN_REVIEW_CHAPTER,
  SET_CATEGORY_ID,
  SET_LOCATION_SEARCH,
  SET_SUBTOPIC_ID,
  SET_TOPIC_ID,
  SET_UPDATED_IN_REVIEW,
  SET_VA_HEALTH_FACILITY,
} from '../actions';

import {
  GEOCODE_COMPLETE,
  GEOCODE_FAILED,
  GEOLOCATE_USER,
} from '../actions/geoLocateUser';

export const initialReduxState = {
  categoryID: '',
  topicID: '',
  subtopicID: '',
  updatedInReview: '',
  searchLocationInput: '',
  getLocationInProgress: false,
  currentUserLocation: [],
  getLocationError: false,
  selectedFacility: null,
  vaHealthFacility: '',
  reviewPageView: {
    openChapters: [],
  },
};

export default {
  form: createSaveInProgressFormReducer(formConfig),
  test: 'test',
  askVA: (state = initialReduxState, action) => {
    switch (action.type) {
      case CLEAR_FORM_DATA:
        return {
          ...initialReduxState,
        };
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
      case SET_SUBTOPIC_ID:
        return {
          ...state,
          subtopicID: action.payload,
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
      case GEOLOCATE_USER:
        return {
          ...state,
          getLocationInProgress: true,
        };
      case GEOCODE_FAILED:
        return {
          ...state,
          getLocationError: true,
          getLocationInProgress: false,
        };
      case GEOCODE_COMPLETE:
        return {
          ...state,
          currentUserLocation: action.payload,
          getLocationInProgress: false,
        };
      case SET_LOCATION_SEARCH:
        return {
          ...state,
          searchLocationInput: action.payload,
        };
      case SET_VA_HEALTH_FACILITY:
        return {
          ...state,
          vaHealthFacility: action.payload,
        };
      default:
        return state;
    }
  },
};
