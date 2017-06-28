import set from 'lodash/fp/set';

const initialState = {
  letters: [],
  destination: {},
  lettersAvailable: false,
  benefitInfo: {},
  serviceInfo: [],
  optionsAvailable: false
};

function letters(state = initialState, action) {
  switch (action.type) {
    case 'GET_LETTERS_SUCCESS':
      return {
        ...state,
        letters: action.data.data.attributes.letters,
        destination: action.data.meta.address,
        lettersAvailable: true
      };
    case 'GET_LETTERS_FAILURE':
      // We are currently ignoring this; consider removing once we're sure we've handled
      // the various error scenarios
      return set('lettersAvailable', false, state);
    case 'GET_BENEFIT_SUMMARY_OPTIONS_SUCCESS':
      return {
        ...state,
        benefitInfo: action.data.data.attributes.benefitInformation,
        serviceInfo: action.data.data.attributes.militaryService,
        optionsAvailable: true
      };
    case 'GET_BENEFIT_SUMMARY_OPTIONS_FAILURE':
      // We are currently ignoring this; consider removing once we're sure we've handled
      // the various error scenarios
      return set('optionsAvailable', false, state);
    default:
      return state;
  }
}

export default {
  letters
};
