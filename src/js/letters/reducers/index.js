import set from 'lodash/fp/set';
import mapValues from 'lodash/mapValues';

const initialState = {
  letters: [],
  destination: {},
  lettersAvailable: false,
  benefitInfo: {},
  serviceInfo: [],
  optionsAvailable: false,
  optionsToInclude: {}
};

function letters(state = initialState, action) {
  let options = {};

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
      // Create object for which options to include in post for summary letter
      // Default all options to true so they appear checked in the UI
      options = mapValues(action.data.data.attributes.benefitInformation, (value) => {
        // If the value of the benefit option is not false, it means the user
        // is eligible for that value. Default benefit options they are eligible for
        // to true. Keep benefit options that have a value of false as false, so
        // they are sent as false in the request for the pdf.
        return value !== false;
      });

      return {
        ...state,
        benefitInfo: action.data.data.attributes.benefitInformation,
        serviceInfo: action.data.data.attributes.militaryService,
        optionsAvailable: true,
        optionsToInclude: options
      };
    case 'GET_BENEFIT_SUMMARY_OPTIONS_FAILURE':
      // We are currently ignoring this; consider removing once we're sure we've handled
      // the various error scenarios
      return set('optionsAvailable', false, state);
    case 'UPDATE_BENEFIT_SUMMARY_OPTION':
      return set(['optionsToInclude', action.propertyPath], action.value, state);
    default:
      return state;
  }
}

export default {
  letters
};
