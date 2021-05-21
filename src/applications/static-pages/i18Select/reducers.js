// import _ from 'lodash/fp';

const initialState = {
  lang: 'en',
};

export default function i18Reducer(state = initialState, action) {
  if (action.type === 'LANG_SELECTED') {
    return { ...state, lang: action.lang };
  }
  return state;
}
