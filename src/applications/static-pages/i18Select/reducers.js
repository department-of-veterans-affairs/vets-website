import { LANG_SELECTED } from 'applications/static-pages/i18Select/actions';

const initialState = {
  lang: 'en',
};

export default function i18Reducer(state = initialState, action) {
  if (action.type === LANG_SELECTED) {
    return { ...state, lang: action.lang };
  }
  return state;
}
