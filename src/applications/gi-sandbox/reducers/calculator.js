import { isFinite } from 'lodash';
import camelCaseKeysRecursive from 'camelcase-keys-recursive';

import {
  CALCULATOR_INPUTS_CHANGED,
  BENEFICIARY_ZIP_CODE_CHANGED,
  FETCH_BAH_FAILED,
  FETCH_BAH_STARTED,
  FETCH_BAH_SUCCEEDED,
  FETCH_PROFILE_STARTED,
  FETCH_PROFILE_SUCCEEDED,
  UPDATE_ESTIMATED_BENEFITS,
} from '../actions';

const beneficiaryZIPRegExTester = /^\d{1,5}$/;

const INITIAL_STATE = {
  beneficiaryLocationQuestion: null,
  beneficiaryZIP: '',
  extension: '',
  inState: 'yes',
  tuitionInState: 0,
  tuitionOutOfState: 0,
  tuitionFees: 0,
  inStateTuitionFees: 0,
  books: 0,
  yellowRibbonRecipient: 'no',
  yellowRibbonAmount: 0,
  giBillBenefit: 'no',
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
  vetTecTuitionFees: null,
  vetTecScholarships: null,
  vetTecProgramName: '',
  selectedProgram: '',
  classesOutsideUS: false,
  estimatedBenefits: {
    bookStipend: { visible: false },
    giBillPaysToSchool: { visible: false },
    housingAllowance: { visible: false },
    outOfPocketTuition: { visible: false },
    totalPaidToYou: { visible: false },
    tuitionAndFeesCharged: { visible: false },
    yourScholarships: { visible: false },
    perTerm: {
      tuitionFees: { visible: false },
      yellowRibbon: { visible: false },
      housingAllowance: { visible: false },
      bookStipend: { visible: false },
    },
  },
};

export default function(state = INITIAL_STATE, action) {
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
        'buyUpAmount',
        'vetTecTuitionFees',
        'vetTecScholarships',
      ].includes(field);

      if (isDollarAmount && !isFinite(value)) {
        convertedValue = +value.replace(/[^0-9.]+/g, '');
      }

      let newState = {
        [field]: convertedValue,
      };

      if (field === 'EstimateYourBenefitsFields') {
        newState = {
          ...newState,
          vetTecProgramName: value.vetTecProgramName,
          vetTecTuitionFees: value.vetTecTuitionFees,
          vetTecScholarships: value.vetTecScholarships,
          vetTecProgramFacilityCode: value.vetTecProgramFacilityCode,
          selectedProgram: value.vetTecProgramName,
        };
      }

      if (field === 'vetTecProgram') {
        newState = {
          ...newState,
          vetTecProgramName: value.vetTecProgramName,
          vetTecTuitionFees: value.vetTecTuitionFees,
          vetTecProgramFacilityCode: value.vetTecProgramFacilityCode,
        };
      }

      if (field === 'yellowRibbonDegreeLevel') {
        if (value === 'customAmount') {
          newState = {
            ...newState,
            yellowRibbonAmount: 0,
            yellowRibbonDivisionOptions: [],
            yellowRibbonDivision: '',
            yellowRibbonProgramIndex: -1,
            yellowRibbonMaxAmount: 0,
            yellowRibbonMaxNumberOfStudents: 0,
          };
        } else {
          const { yellowRibbonPrograms } = state;

          // make an array of unique values
          const yellowRibbonDivisionOptions =
            yellowRibbonPrograms.length > 0
              ? [
                  ...new Set(
                    yellowRibbonPrograms
                      .filter(program => program.degreeLevel === value)
                      .map(program => program.divisionProfessionalSchool),
                  ),
                ]
              : [];

          const {
            contributionAmount: yellowRibbonAmount,
            numberOfStudents: yellowRibbonMaxNumberOfStudents,
            index: yellowRibbonProgramIndex,
          } = yellowRibbonPrograms.find(
            program =>
              program.degreeLevel === value &&
              program.divisionProfessionalSchool ===
                yellowRibbonDivisionOptions[0],
          );

          newState = {
            ...newState,
            yellowRibbonAmount,
            yellowRibbonDivisionOptions,
            yellowRibbonDivision: yellowRibbonDivisionOptions[0],
            yellowRibbonProgramIndex,
            yellowRibbonMaxAmount: yellowRibbonAmount,
            yellowRibbonMaxNumberOfStudents,
          };
        }
      }

      if (field === 'yellowRibbonDivision') {
        const { yellowRibbonDegreeLevel, yellowRibbonPrograms } = state;

        const {
          contributionAmount: yellowRibbonAmount,
          numberOfStudents: yellowRibbonMaxNumberOfStudents,
          index: yellowRibbonProgramIndex,
        } = yellowRibbonPrograms.find(
          program =>
            program.degreeLevel === yellowRibbonDegreeLevel &&
            program.divisionProfessionalSchool === value,
        );

        newState = {
          ...newState,
          yellowRibbonAmount,
          yellowRibbonProgramIndex,
          yellowRibbonMaxAmount: yellowRibbonAmount,
          yellowRibbonMaxNumberOfStudents,
        };
      }

      if (field === 'inState') {
        newState.tuitionFees =
          value === 'yes' ? state.tuitionInState : state.tuitionOutOfState;

        newState.inStateTuitionFees = state.tuitionInState;
      }

      return {
        ...state,
        ...newState,
      };
    }

    case FETCH_BAH_FAILED: {
      const { beneficiaryZIPFetched, error = {} } = action;

      // institution and zipcode_rates endpoints both return this generic error
      const errorMessage =
        error.message === 'Record not found'
          ? 'No rates for this postal code found. Try another postal code'
          : 'Something went wrong. Try again';

      // response mismatch - do nothing
      if (beneficiaryZIPFetched !== state.beneficiaryZIPFetched) {
        return state;
      }

      const newState = {
        beneficiaryZIPError: errorMessage,
        beneficiaryZIPFetched: '',
        beneficiaryLocationBah: null,
        beneficiaryLocationGrandfatheredBah: null,
        housingAllowanceCity: '',
      };

      return {
        ...state,
        ...newState,
      };
    }

    case FETCH_BAH_STARTED: {
      const { beneficiaryZIPFetched } = action;

      const newState = {
        beneficiaryLocationBah: null,
        beneficiaryLocationGrandfatheredBah: null,
        beneficiaryZIPError: '',
        beneficiaryZIP: beneficiaryZIPFetched,
        beneficiaryZIPFetched,
        housingAllowanceCity: '',
      };

      return {
        ...state,
        ...newState,
      };
    }

    case FETCH_BAH_SUCCEEDED: {
      const { beneficiaryZIPFetched } = action;
      const {
        mhaRate: beneficiaryLocationBah,
        mhaRateGrandfathered: beneficiaryLocationGrandfatheredBah,
        mhaName: housingAllowanceCity,
      } = action.payload.data.attributes;

      // response mismatch - do nothing
      if (beneficiaryZIPFetched !== state.beneficiaryZIPFetched) {
        return state;
      }

      const newState = {
        beneficiaryZIPError: '',
        beneficiaryZIPFetched: '',
        beneficiaryLocationBah,
        beneficiaryLocationGrandfatheredBah,
        housingAllowanceCity,
      };

      return {
        ...state,
        ...newState,
      };
    }
    case BENEFICIARY_ZIP_CODE_CHANGED: {
      const { beneficiaryZIP } = action;

      let beneficiaryZIPError;

      if (
        beneficiaryZIP !== '' &&
        !beneficiaryZIPRegExTester.exec(beneficiaryZIP)
      ) {
        beneficiaryZIPError = 'Postal code must be a 5-digit number';
      } else {
        beneficiaryZIPError = '';
      }

      const newState = {
        beneficiaryZIP,
        beneficiaryZIPError,
        beneficiaryZIPFetched: '',
        beneficiaryLocationBah: null,
        beneficiaryLocationGrandfatheredBah: null,
        housingAllowanceCity: '',
      };

      return {
        ...state,
        ...newState,
      };
    }

    case FETCH_PROFILE_STARTED: {
      return {
        ...state,
        selectedProgram: INITIAL_STATE.selectedProgram,
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

      let { yellowRibbonPrograms } = camelPayload.data.attributes;

      let yellowRibbonDegreeLevelOptions = [];
      let yellowRibbonDivisionOptions = [];
      let yellowRibbonDegreeLevel = '';
      let yellowRibbonDivision = '';
      let yellowRibbonAmount = 0;
      let yellowRibbonMaxAmount;
      let yellowRibbonMaxNumberOfStudents;
      let yellowRibbonProgramIndex;

      if (yellowRibbonPrograms.length > 0) {
        yellowRibbonPrograms = yellowRibbonPrograms.map((program, index) => ({
          ...program,
          index,
        }));
        yellowRibbonDegreeLevelOptions = [
          ...new Set(yellowRibbonPrograms.map(program => program.degreeLevel)),
        ];
        // first value of degree level is selected by default; only display division options associated with this degree level
        yellowRibbonDivisionOptions = [
          ...new Set(
            yellowRibbonPrograms
              .filter(
                program =>
                  program.degreeLevel === yellowRibbonDegreeLevelOptions[0],
              )
              .map(program => program.divisionProfessionalSchool),
          ),
        ];

        yellowRibbonAmount = yellowRibbonPrograms[0].contributionAmount;
        yellowRibbonMaxAmount = yellowRibbonAmount;
        yellowRibbonDegreeLevel = yellowRibbonPrograms[0].degreeLevel;
        yellowRibbonDivision =
          yellowRibbonPrograms[0].divisionProfessionalSchool;
        yellowRibbonMaxNumberOfStudents =
          yellowRibbonPrograms[0].numberOfStudents;
        yellowRibbonProgramIndex = yellowRibbonPrograms[0].index;
      }

      let giBillBenefit = INITIAL_STATE.giBillBenefit;

      // Set default GI BILL benefit status to the lowest rate (DOD or BAH)
      if (action.payload.data.attributes.country === 'USA') {
        giBillBenefit =
          action.payload.data.attributes.dodBah &&
          action.payload.data.attributes.dodBah <
            action.payload.data.attributes.bah
            ? 'no'
            : 'yes';
      } else {
        giBillBenefit =
          action.payload.AVGDODBAH &&
          action.payload.AVGDODBAH < action.payload.AVGVABAH
            ? 'no'
            : 'yes';
      }

      const vetTecProgramName =
        state.vetTecProgramFacilityCode ===
        camelPayload.data.attributes.facilityCode
          ? state.vetTecProgramName
          : INITIAL_STATE.vetTecProgramName;

      const vetTecTuitionFees =
        state.vetTecProgramFacilityCode ===
        camelPayload.data.attributes.facilityCode
          ? state.vetTecTuitionFees
          : INITIAL_STATE.vetTecTuitionFees;

      return {
        ...INITIAL_STATE,
        giBillBenefit,
        type,
        beneficiaryLocationBah: null,
        beneficiaryLocationGrandfatheredBah: null,
        tuitionInState: tuitionInState || 0,
        tuitionOutOfState: tuitionOutOfState || 0,
        tuitionFees: tuitionInState || 0,
        inStateTuitionFees: tuitionInState || 0,
        books: books || 0,
        calendar: calendar || 'semesters',
        yellowRibbonAmount,
        yellowRibbonDegreeLevel,
        yellowRibbonDivision,
        yellowRibbonDegreeLevelOptions,
        yellowRibbonDivisionOptions,
        yellowRibbonMaxAmount,
        yellowRibbonMaxNumberOfStudents,
        yellowRibbonPrograms,
        yellowRibbonProgramIndex,
        vetTecProgramName,
        vetTecTuitionFees,
      };
    }

    case UPDATE_ESTIMATED_BENEFITS: {
      const { estimatedBenefits } = action;
      return {
        ...state,
        estimatedBenefits,
      };
    }

    default:
      return state;
  }
}
