import { expect } from 'chai';

import travelPayReducer from '../../redux/reducer';
import {
  FETCH_TRAVEL_CLAIMS_STARTED,
  FETCH_TRAVEL_CLAIMS_SUCCESS,
  FETCH_TRAVEL_CLAIMS_FAILURE,
  FETCH_CLAIM_DETAILS_STARTED,
  FETCH_CLAIM_DETAILS_SUCCESS,
  FETCH_CLAIM_DETAILS_FAILURE,
  FETCH_APPOINTMENT_STARTED,
  FETCH_APPOINTMENT_SUCCESS,
  FETCH_APPOINTMENT_FAILURE,
  SUBMIT_CLAIM_STARTED,
  SUBMIT_CLAIM_SUCCESS,
  SUBMIT_CLAIM_FAILURE,
  DELETE_DOCUMENT_STARTED,
  DELETE_DOCUMENT_SUCCESS,
  DELETE_DOCUMENT_FAILURE,
  SET_EXPENSE_BACK_DESTINATION,
} from '../../redux/actions';

const { travelPay: reducer } = travelPayReducer;

const defaultState = {
  appointment: {},
  travelClaims: {},
  claimDetails: {},
  claimSubmission: {},
};

describe('Redux - reducer', () => {
  it('should update state as expected for FETCH_TRAVEL_CLAIMS_STARTED action', () => {
    expect(
      reducer(defaultState, { type: FETCH_TRAVEL_CLAIMS_STARTED }),
    ).to.deep.equal({
      ...defaultState,
      travelClaims: {
        isLoading: true,
      },
    });
  });

  it('should update state as expected for FETCH_TRAVEL_CLAIMS_SUCCESS action', () => {
    expect(
      reducer(defaultState, {
        type: FETCH_TRAVEL_CLAIMS_SUCCESS,
        dateRangeId: 'test',
        payload: { data: [{ a: 'b' }], metadata: { c: 'd' } },
      }),
    ).to.deep.equal({
      ...defaultState,
      travelClaims: {
        claims: {
          test: {
            metadata: {
              c: 'd',
            },
            data: [
              {
                a: 'b',
              },
            ],
            error: null,
          },
        },
        isLoading: false,
      },
    });
  });

  it('should update state as expected for FETCH_TRAVEL_CLAIMS_FAILURE action', () => {
    expect(
      reducer(defaultState, {
        type: FETCH_TRAVEL_CLAIMS_FAILURE,
        dateRangeId: 'test',
        error: { status: 400, message: 'there was a problem' },
      }),
    ).to.deep.equal({
      ...defaultState,
      travelClaims: {
        claims: {
          test: {
            metadata: {},
            data: [],
            error: { status: 400, message: 'there was a problem' },
          },
        },
        isLoading: false,
      },
    });
  });

  it('should update state as expected for FETCH_CLAIM_DETAILS_STARTED action', () => {
    expect(
      reducer(defaultState, { type: FETCH_CLAIM_DETAILS_STARTED }),
    ).to.deep.equal({
      ...defaultState,
      claimDetails: {
        isLoading: true,
      },
    });
  });

  it('should update state as expected for FETCH_CLAIM_DETAILS_SUCCESS action', () => {
    expect(
      reducer(defaultState, {
        type: FETCH_CLAIM_DETAILS_SUCCESS,
        id: '123',
        payload: { a: 'b' },
      }),
    ).to.deep.equal({
      ...defaultState,
      claimDetails: {
        data: {
          '123': { a: 'b' },
        },
        error: null,
        isLoading: false,
      },
    });
  });

  it('should update state as expected for FETCH_CLAIM_DETAILS_FAILURE action', () => {
    expect(
      reducer(defaultState, {
        type: FETCH_CLAIM_DETAILS_FAILURE,
        error: { status: 400, message: 'there was a problem' },
      }),
    ).to.deep.equal({
      ...defaultState,
      claimDetails: {
        error: { status: 400, message: 'there was a problem' },
        isLoading: false,
      },
    });
  });

  it('should update state as expected for FETCH_APPOINTMENT_STARTED action', () => {
    expect(
      reducer(defaultState, {
        type: FETCH_APPOINTMENT_STARTED,
      }),
    ).to.deep.equal({
      ...defaultState,
      appointment: {
        isLoading: true,
      },
    });
  });

  it('should update state as expected for FETCH_APPOINTMENT_SUCCESS action', () => {
    expect(
      reducer(defaultState, {
        type: FETCH_APPOINTMENT_SUCCESS,
        payload: { a: 'b' },
      }),
    ).to.deep.equal({
      ...defaultState,
      appointment: {
        data: { a: 'b' },
        isLoading: false,
        error: null,
      },
    });
  });

  it('should update state as expected for FETCH_APPOINTMENT_FAILURE action', () => {
    expect(
      reducer(defaultState, {
        type: FETCH_APPOINTMENT_FAILURE,
        error: { status: 400, message: 'there was a problem' },
      }),
    ).to.deep.equal({
      ...defaultState,
      appointment: {
        error: { status: 400, message: 'there was a problem' },
        isLoading: false,
      },
    });
  });

  it('should update state as expected for SUBMIT_CLAIM_STARTED action', () => {
    expect(
      reducer(defaultState, {
        type: SUBMIT_CLAIM_STARTED,
      }),
    ).to.deep.equal({
      ...defaultState,
      claimSubmission: {
        isSubmitting: true,
      },
    });
  });

  it('should update state as expected for SUBMIT_CLAIM_SUCCESS action', () => {
    expect(
      reducer(defaultState, {
        type: SUBMIT_CLAIM_SUCCESS,
        payload: { a: 'b' },
      }),
    ).to.deep.equal({
      ...defaultState,
      claimSubmission: {
        data: { a: 'b' },
        error: null,
        isSubmitting: false,
      },
    });
  });

  it('should update state as expected for SUBMIT_CLAIM_FAILURE action', () => {
    expect(
      reducer(defaultState, {
        type: SUBMIT_CLAIM_FAILURE,
        error: { status: 400, message: 'there was a problem' },
      }),
    ).to.deep.equal({
      ...defaultState,
      claimSubmission: {
        error: { status: 400, message: 'there was a problem' },
        isSubmitting: false,
      },
    });
  });

  describe('DELETE_DOCUMENT actions', () => {
    const stateWithComplexClaim = {
      ...defaultState,
      complexClaim: {
        claim: {
          creation: { isLoading: false, error: null },
          submission: { id: '', isSubmitting: false, error: null, data: null },
          fetch: { isLoading: false, error: null },
          data: null,
        },
        expenses: {
          creation: { isLoading: false, error: null },
          update: { id: '', isLoading: false, error: null },
          delete: { id: '', isLoading: false, error: null },
          data: [],
        },
        documentDelete: {
          id: '',
          isLoading: false,
          error: null,
        },
      },
    };

    it('should update state for DELETE_DOCUMENT_STARTED action', () => {
      expect(
        reducer(stateWithComplexClaim, {
          type: DELETE_DOCUMENT_STARTED,
          documentId: 'doc123',
        }),
      ).to.deep.equal({
        ...stateWithComplexClaim,
        complexClaim: {
          ...stateWithComplexClaim.complexClaim,
          documentDelete: {
            id: 'doc123',
            isLoading: true,
            error: null,
          },
        },
      });
    });

    it('should update state for DELETE_DOCUMENT_SUCCESS action', () => {
      const loadingState = {
        ...stateWithComplexClaim,
        complexClaim: {
          ...stateWithComplexClaim.complexClaim,
          documentDelete: {
            id: 'doc123',
            isLoading: true,
            error: null,
          },
        },
      };

      expect(
        reducer(loadingState, {
          type: DELETE_DOCUMENT_SUCCESS,
          documentId: 'doc123',
        }),
      ).to.deep.equal({
        ...loadingState,
        complexClaim: {
          ...loadingState.complexClaim,
          documentDelete: {
            id: '',
            isLoading: false,
            error: null,
          },
        },
      });
    });

    it('should update state for DELETE_DOCUMENT_FAILURE action', () => {
      const loadingState = {
        ...stateWithComplexClaim,
        complexClaim: {
          ...stateWithComplexClaim.complexClaim,
          documentDelete: {
            id: 'doc123',
            isLoading: true,
            error: null,
          },
        },
      };

      expect(
        reducer(loadingState, {
          type: DELETE_DOCUMENT_FAILURE,
          documentId: 'doc123',
          error: { status: 500, message: 'Delete failed' },
        }),
      ).to.deep.equal({
        ...loadingState,
        complexClaim: {
          ...loadingState.complexClaim,
          documentDelete: {
            id: 'doc123',
            isLoading: false,
            error: { status: 500, message: 'Delete failed' },
          },
        },
      });
    });
  });

  it('should update state as expected for SET_EXPENSE_BACK_DESTINATION action', () => {
    expect(
      reducer(defaultState, {
        type: SET_EXPENSE_BACK_DESTINATION,
        payload: 'some-arbitrary-value',
      }),
    ).to.deep.equal({
      ...defaultState,
      complexClaim: {
        ...defaultState.complexClaim,
        expenseBackDestination: 'some-arbitrary-value',
      },
    });
  });
});
