import { isFinite } from 'lodash';
import camelCaseKeysRecursive from 'camelcase-keys-recursive';

import {
  CALCULATOR_INPUTS_CHANGED,
  CAMPUS_ZIP_CODE_CHANGE,
  FETCH_PROFILE_SUCCEEDED
} from '../actions';

const campusZipRegExTester = /\b\d{5}\b/;
const INITIAL_STATE = {
  campusZip: '0000',
  inState: 'yes',
  tuitionInState: 0,
  tuitionOutOfState: 0,
  tuitionFees: 0,
  inStateTuitionFees: 0,
  books: 0,
  yellowRibbonRecipient: 'no',
  yellowRibbonAmount: 0,
  scholarships: 0,
  tuitionAssist: 0,
  enrolled: 'full',
  enrolledOld: 'full',
  calendar: 'semesters',
  working: '30',
  numberNontradTerms: '2',
  lengthNontradTerms: '3',
  kickerEligible: 'no',
  kickerAmount: 200,
  buyUp: 'no',
  buyUpAmount: 600,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case CALCULATOR_INPUTS_CHANGED: {
      const { field, value } = action;
      let convertedValue = value;

      const isDollarAmount = [
        'tuitionFees',
        'inStateTuitionFees',
        'books',
        'yellowRibbonAmount',
        'scholarships',
        'tuitionAssist',
        'kickerAmount',
        'buyUpAmount'
      ].includes(field);

      if (isDollarAmount && !isFinite(value)) {
      // Strip all non-numeric characters.
        convertedValue = +value.replace(/[^0-9.]+/g, '');
      }

      const newState = {
        [field]: convertedValue,
      };

      if (field === 'inState') {
        newState.tuitionFees =
          value === 'yes' ?
            state.tuitionInState :
            state.tuitionOutOfState;

        newState.inStateTuitionFees = state.tuitionInState;
      }

      return {
        ...state,
        ...newState
      };
    }
    case CAMPUS_ZIP_CODE_CHANGE: {
      const { campusZip } = action;

      let campusZipError = state.campusZipError || '';

      if (campusZip.length >= 5 && !campusZipRegExTester.exec(campusZip)) {
        campusZipError = 'Zip Code must be a five digit number';
      } else {
        campusZipError = '';
      }

      const newState = {
        campusZip,
        campusZipError,
        housingAllowanceCity: 'New York, NY'
      };

      return {
        ...state,
        ...newState
      };
    }

    case FETCH_PROFILE_SUCCEEDED: {
      const camelPayload = camelCaseKeysRecursive(action.payload);

      const {
        tuitionInState,
        tuitionOutOfState,
        books,
        calendar,
        type,
      } = camelPayload.data.attributes;

      return {
        ...INITIAL_STATE,
        type,
        tuitionInState: tuitionInState || 0,
        tuitionOutOfState: tuitionOutOfState || 0,
        tuitionFees: tuitionInState || 0,
        inStateTuitionFees: tuitionInState || 0,
        books: books || 0,
        calendar: calendar || 'semesters'
      };
    }

    default:
      return state;
  }
}
