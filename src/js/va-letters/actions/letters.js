// import { apiRequest } from '../utils/helpers';

// TODO: remove this hard-coded response once we can fetch from a vets-api endpoint
const letterListResponse = {
  letterDestination: {
    addressLine1: '2476 Main Street',
    addressLine2: 'Ste #12',
    addressLine3: 'West',
    city: 'Reston',
    country: 'US',
    foreignCode: '865',
    fullName: 'Mark Webb',
    state: 'VA',
    zipCode: '12345'
  },
  letters: [
    {
      letterName: 'Commissary Letter',
      letterType: 'commissary'
    },
    {
      letterName: 'Proof of Service Letter',
      letterType: 'proof_of_service'
    },
    {
      letterName: 'Proof of Creditable Prescription Drug Coverage Letter',
      letterType: 'medicare_partd'
    },
    {
      letterName: 'Proof of Minimum Essential Coverage Letter',
      letterType: 'minimum_essential_coverage'
    },
    {
      letterName: 'Service Verification Letter',
      letterType: 'service_verification'
    },
    {
      letterName: 'Civil Service Preference Letter',
      letterType: 'civil_service'
    },
    {
      letterName: 'Benefit Summary Letter',
      letterType: 'benefit_summary'
    },
    {
      letterName: 'Benefit Verification Letter',
      letterType: 'benefit_verification'
    }
  ]
};

export function getLetterList() {
  return (dispatch) => {
    return dispatch({
      type: 'GET_LETTERS_SUCCESS',
      data: letterListResponse
    });
    /*
    apiRequest('/v0/va_letters/letters',
               null,
      (response) => {
        return dispatch({
          type: 'GET_LETTERS_SUCCESS',
          data: response.data,
        });
      },
      () => dispatch({
        type: 'GET_LETTERS_FAILURE'
      })
    );
    */
  };
}
