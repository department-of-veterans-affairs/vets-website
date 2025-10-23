import { expect } from 'chai';

import {
  BACKEND_SERVICE_ERROR,
  FETCH_APPEALS_ERROR,
  FETCH_APPEALS_PENDING,
  FETCH_APPEALS_SUCCESS,
  FETCH_CLAIMS_ERROR,
  FETCH_CLAIMS_PENDING,
  FETCH_CLAIMS_SUCCESS,
  FETCH_STEM_CLAIMS_ERROR,
  FETCH_STEM_CLAIMS_PENDING,
  FETCH_STEM_CLAIMS_SUCCESS,
  RECORD_NOT_FOUND_ERROR,
  USER_FORBIDDEN_ERROR,
  VALIDATION_ERROR,
} from '../../actions/types';
import {
  appealsAvailability,
  claimsAvailability,
} from '../../utils/appeals-v2-helpers';

import claimsV2Reducer from '../../reducers/claimsV2';

const claims = [{ id: 1, type: 'claim' }];
const appeals = [{ id: 1, type: 'appeal' }];
const stemClaims = [{ id: 1, type: 'education_benefits_claims' }];

describe('claimsV2Reducer', () => {
  it('should show FETCH_CLAIMS_PENDING', () => {
    const state = claimsV2Reducer(undefined, {
      type: FETCH_CLAIMS_PENDING,
      claimsLoading: true,
    });

    expect(state.claimsLoading).to.be.true;
  });

  it('should show FETCH_CLAIMS_SUCCESS', () => {
    const state = claimsV2Reducer(undefined, {
      type: FETCH_CLAIMS_SUCCESS,
      claims,
      claimsLoading: false,
      claimsAvailability: claimsAvailability.AVAILABLE,
    });

    expect(state.claims[0].id).to.exist;
    expect(state.claimsLoading).to.be.false;
    expect(state.claimsAvailability).to.equal(claimsAvailability.AVAILABLE);
  });

  it('should show FETCH_CLAIMS_ERROR', () => {
    const state = claimsV2Reducer(undefined, {
      type: FETCH_CLAIMS_ERROR,
      claimsLoading: false,
      claimsAvailability: claimsAvailability.UNAVAILABLE,
    });

    expect(state.claimsLoading).to.be.false;
    expect(state.claimsAvailability).to.equal(claimsAvailability.UNAVAILABLE);
  });

  it('should show FETCH_APPEALS_PENDING', () => {
    const state = claimsV2Reducer(undefined, {
      type: FETCH_APPEALS_PENDING,
      appealsLoading: true,
    });

    expect(state.appealsLoading).to.be.true;
  });

  it('should show FETCH_APPEALS_SUCCESS', () => {
    const state = claimsV2Reducer(undefined, {
      type: FETCH_APPEALS_SUCCESS,
      appeals,
      appealsLoading: false,
      available: true,
      v2Availability: appealsAvailability.AVAILABLE,
    });

    expect(state.appeals[0].id).to.exist;
    expect(state.appealsLoading).to.be.false;
    expect(state.available).to.be.true;
    expect(state.v2Availability).to.equal(appealsAvailability.AVAILABLE);
  });

  it('should show USER_FORBIDDEN_ERROR', () => {
    const state = claimsV2Reducer(undefined, {
      type: USER_FORBIDDEN_ERROR,
      appealsLoading: false,
      v2Availability: appealsAvailability.USER_FORBIDDEN_ERROR,
    });

    expect(state.appealsLoading).to.be.false;
    expect(state.v2Availability).to.equal(
      appealsAvailability.USER_FORBIDDEN_ERROR,
    );
  });

  it('should show RECORD_NOT_FOUND_ERROR', () => {
    const state = claimsV2Reducer(undefined, {
      type: RECORD_NOT_FOUND_ERROR,
      appealsLoading: false,
      v2Availability: appealsAvailability.RECORD_NOT_FOUND_ERROR,
    });

    expect(state.appealsLoading).to.be.false;
    expect(state.v2Availability).to.equal(
      appealsAvailability.RECORD_NOT_FOUND_ERROR,
    );
  });

  it('should show VALIDATION_ERROR', () => {
    const state = claimsV2Reducer(undefined, {
      type: VALIDATION_ERROR,
      appealsLoading: false,
      v2Availability: appealsAvailability.VALIDATION_ERROR,
    });

    expect(state.appealsLoading).to.be.false;
    expect(state.v2Availability).to.equal(appealsAvailability.VALIDATION_ERROR);
  });

  it('should show BACKEND_SERVICE_ERROR', () => {
    const state = claimsV2Reducer(undefined, {
      type: BACKEND_SERVICE_ERROR,
      appealsLoading: false,
      v2Availability: appealsAvailability.BACKEND_SERVICE_ERROR,
    });

    expect(state.appealsLoading).to.be.false;
    expect(state.v2Availability).to.equal(
      appealsAvailability.BACKEND_SERVICE_ERROR,
    );
  });

  it('should show FETCH_APPEALS_ERROR', () => {
    const state = claimsV2Reducer(undefined, {
      type: FETCH_APPEALS_ERROR,
      appealsLoading: false,
      v2Availability: appealsAvailability.FETCH_APPEALS_ERROR,
    });

    expect(state.appealsLoading).to.be.false;
    expect(state.v2Availability).to.equal(
      appealsAvailability.FETCH_APPEALS_ERROR,
    );
  });

  it('should show FETCH_STEM_CLAIMS_PENDING', () => {
    const state = claimsV2Reducer(undefined, {
      type: FETCH_STEM_CLAIMS_PENDING,
      stemClaimsLoading: true,
    });

    expect(state.stemClaimsLoading).to.be.true;
  });

  it('should show FETCH_STEM_CLAIMS_ERROR', () => {
    const state = claimsV2Reducer(undefined, {
      type: FETCH_STEM_CLAIMS_ERROR,
      stemClaimsLoading: false,
    });

    expect(state.stemClaimsLoading).to.be.false;
  });

  it('should show FETCH_STEM_CLAIMS_SUCCESS', () => {
    const state = claimsV2Reducer(undefined, {
      type: FETCH_STEM_CLAIMS_SUCCESS,
      stemClaimsLoading: false,
      stemClaims,
    });

    expect(state.stemClaimsLoading).to.be.false;
  });
});
