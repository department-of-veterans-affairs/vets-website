import set from 'lodash/fp/set';

const initialState = {
  letters: [],
  destination: {},
  available: false
};

function letters(state = initialState, action) {
  switch (action.type) {
    case 'GET_LETTERS_SUCCESS':
      return {
        ...state,
        letters: action.data.data.attributes.letters,
        destination: action.data.meta.address,
        available: true
      };
    case 'GET_LETTERS_FAILURE':
      return set('available', false, state);
    default:
      return state;
  }
}

export default {
  letters
};
