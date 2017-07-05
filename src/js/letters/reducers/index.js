import _ from 'lodash/fp';
// import { benefitOptionsMap } from '../utils/helpers';

const initialState = {
  letters: [],
  destination: {},
  lettersAvailability: 'awaitingResponse',
  benefitInfo: {},
  serviceInfo: [],
  optionsAvailable: false,
  optionsToInclude: {}
};

function letters(state = initialState, action) {
  let options = {};

  let letterList;
  switch (action.type) {
    case 'GET_LETTERS_SUCCESS':
      // Hard-code a few extra letters for usability testing purposes. Revert after testing.
      letterList = action.data.data.attributes.letters;
      if (_.findIndex({ letterType: 'medicare_partd' }, letterList) < 0) {
        letterList = _.concat(letterList, [{
          name: 'Proof of Creditable Prescription Drug Coverage Letter',
          letterType: 'medicare_partd'
        }]
        );
      }
      if (_.findIndex({ letterType: 'minimum_essential_coverage' }, letterList) < 0) {
        letterList = _.concat(letterList, [{
          name: 'Proof of Minimum Essential Coverage Letter',
          letterType: 'minimum_essential_coverage'
        }]
        );
      }
      return {
        ...state,
        letters: letterList,
        destination: action.data.meta.address,
        lettersAvailability: 'available'
      };
    case 'GET_LETTERS_FAILURE':
      // We are currently ignoring this; consider removing once we're sure we've handled
      // the various error scenarios
      return set('lettersAvailability', 'unavailable', state);
    case 'GET_BENEFIT_SUMMARY_OPTIONS_SUCCESS':
      // Create object for which options to include in the benefit summary letter POST
      // request body, and initialize all options to true so they appear checked in the UI.
      // If the value of the benefit option is anything but false, the user is
      // eligible for that value, so so the request body option is set to true.
      // Otherwise, the request body option is set to false.


      // plus 'militaryService'
      options = _.mapValues((value) => {
        return value !== false;
      }, action.data.data.attributes.benefitInformation);
      // WIP: not quite a zip
      // options = _.zipObject(_.values(benefitOptionsMap),

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
      return _.set('optionsAvailable', false, state);
    case 'UPDATE_BENEFIT_SUMMARY_OPTION':
      return _.set(['optionsToInclude', action.propertyPath], action.value, state);
    default:
      return state;
  }
}

export default {
  letters
};
