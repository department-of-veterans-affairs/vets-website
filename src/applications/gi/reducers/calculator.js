import { isFinite } from 'lodash';
import camelCaseKeysRecursive from 'camelcase-keys-recursive';

import {
  CALCULATOR_INPUTS_CHANGED,
  BENEFICIARY_ZIP_CODE_CHANGED,
  FETCH_BAH_FAILED,
  FETCH_BAH_STARTED,
  FETCH_BAH_SUCCEEDED,
  FETCH_PROFILE_SUCCEEDED
} from '../actions';

const beneficiaryZIPRegExTester = /\b\d{5}\b/;
const INITIAL_STATE = {
  beneficiaryLocationQuestion: 'yes',
  beneficiaryZIP: '',
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
        // Strip all non-numeric characters
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
    case FETCH_BAH_FAILED: {
      const { beneficiaryZIPFetched } = action;
      const { error } = action.payload;

      // response mismatch - do nothing
      if (beneficiaryZIPFetched !== state.beneficiaryZIPFetched) {
        return state;
      }

      const newState = {
        beneficiaryZIPError: error,
        beneficiaryZIPFetched: '',
        beneficiaryLocationBah: null,
        housingAllowanceCity: ''
      };

      return {
        ...state,
        ...newState
      };
    }

    case FETCH_BAH_STARTED: {
      const { beneficiaryZIPFetched } = action;

      const newState = {
        beneficiaryZIPError: '',
        beneficiaryZIP: beneficiaryZIPFetched,
        beneficiaryZIPFetched,
        housingAllowanceCity: 'Loading...'
      };

      return {
        ...state,
        ...newState
      };
    }

    case FETCH_BAH_SUCCEEDED: {
      const { beneficiaryZIPFetched } = action;
      const {
        bah: beneficiaryLocationBah,
        city: housingAllowanceCity } = action.payload;

      // response mismatch - do nothing
      if (beneficiaryZIPFetched !== state.beneficiaryZIPFetched) {
        return state;
      }

      const newState = {
        beneficiaryZIPError: '',
        beneficiaryZIPFetched: '',
        beneficiaryLocationBah,
        housingAllowanceCity
      };

      return {
        ...state,
        ...newState
      };
    }
    case BENEFICIARY_ZIP_CODE_CHANGED: {
      const { beneficiaryZIP } = action;

      let beneficiaryZIPError = state.beneficiaryZIPError || '';

      if (beneficiaryZIP.length >= 5 && !beneficiaryZIPRegExTester.exec(beneficiaryZIP)) {
        beneficiaryZIPError = 'ZIP Code must be a five digit number';
      } else {
        beneficiaryZIPError = '';
      }

      const newState = {
        beneficiaryZIP,
        beneficiaryZIPError,
        beneficiaryZIPFetched: '',
        beneficiaryLocationBah: null,
        housingAllowanceCity: ''
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
        beneficiaryLocationBah: null,
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
