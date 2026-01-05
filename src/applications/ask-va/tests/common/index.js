import { combineReducers, createStore } from 'redux';
import askVaReducer from '../../reducers';
import { userData } from '../fixtures/data/mock-form-data';

export const createMockStore = ({
  askVA,
  currentlyLoggedIn = true,
  formData = {},
  form,
  path = '',
  viewedPages,
  openChapters,
} = {}) => {
  const reducers = combineReducers({
    ...askVaReducer,
    navigation: (state = { route: { path } }) => state,
    user: (state = { login: { currentlyLoggedIn }, profile: userData }) =>
      state,
  });

  const initialState = {
    askVA: {
      currentUserLocation: [],
      searchLocationInput: '',
      getLocationInProgress: false,
      getLocationError: false,
      facilityData: null,
      validationError: null,
      reviewPageView: {
        viewedPages: viewedPages || new Set(),
        openChapters: openChapters || [],
      },
      ...askVA,
    },
    form: form || {
      data: formData,
      reviewPageView: {
        viewedPages: viewedPages || new Set(),
        openChapters: openChapters || [],
      },
    },
  };

  return createStore(reducers, initialState);
};

export const mockRouterProps = {
  go: () => {},
  goBack: () => {},
  goForward: () => {},
  push: () => {},
  replace: () => {},
  setRouteLeaveHook: () => {},
  isActive: () => {},
  navigation: {},
  location: {},
  params: {},
};
