import { expect } from 'chai';
import claimsReducer from '../../reducers/claims';
import {
  FETCH_CLAIMS_PENDING,
  FETCH_CLAIMS_SUCCESS,
  FETCH_CLAIMS_ERROR,
  FETCH_STEM_CLAIMS_PENDING,
  FETCH_STEM_CLAIMS_SUCCESS,
  FETCH_STEM_CLAIMS_ERROR,
} from '../../actions/claims';
import {
  FETCH_APPEALS_PENDING,
  FETCH_APPEALS_SUCCESS,
  FETCH_APPEALS_ERROR,
  USER_FORBIDDEN_ERROR,
  RECORD_NOT_FOUND_ERROR,
  VALIDATION_ERROR,
  BACKEND_SERVICE_ERROR,
} from '../../actions/appeals';
import { appealsAvailability } from '../../utils/appeals-helpers';
import {
  claimsAvailability,
  CHANGE_INDEX_PAGE,
} from '../../utils/claims-helpers';

describe('claims reducer', () => {
  const initialState = {
    claims: [],
    appeals: [],
    stemClaims: [],
    claimsLoading: false,
    appealsLoading: false,
    stemClaimsLoading: false,
  };

  describe('FETCH_CLAIMS_PENDING', () => {
    it('should preserve other state properties', () => {
      const existingState = {
        ...initialState,
        appeals: [{ id: 1 }],
        appealsLoading: true,
      };

      const state = claimsReducer(existingState, {
        type: FETCH_CLAIMS_PENDING,
      });

      expect(state.appeals).to.eql([{ id: 1 }]);
      expect(state.appealsLoading).to.be.true;
    });
  });

  describe('FETCH_CLAIMS_SUCCESS', () => {
    it('should set claims data and availability', () => {
      const mockClaims = [
        { id: '1', attributes: { claimType: 'compensation' } },
        { id: '2', attributes: { claimType: 'education' } },
      ];

      const state = claimsReducer(initialState, {
        type: FETCH_CLAIMS_SUCCESS,
        claims: mockClaims,
      });

      expect(state.claims).to.eql(mockClaims);
      expect(state.claimsLoading).to.be.false;
      expect(state.claimsAvailability).to.equal(claimsAvailability.AVAILABLE);
    });

    it('should preserve other state properties', () => {
      const existingState = {
        ...initialState,
        appeals: [{ id: 1 }],
        stemClaims: [{ id: 2 }],
      };

      const mockClaims = [{ id: '1' }];

      const state = claimsReducer(existingState, {
        type: FETCH_CLAIMS_SUCCESS,
        claims: mockClaims,
      });

      expect(state.appeals).to.eql([{ id: 1 }]);
      expect(state.stemClaims).to.eql([{ id: 2 }]);
    });

    it('should handle empty claims array', () => {
      const state = claimsReducer(initialState, {
        type: FETCH_CLAIMS_SUCCESS,
        claims: [],
      });

      expect(state.claims).to.eql([]);
      expect(state.claimsLoading).to.be.false;
      expect(state.claimsAvailability).to.equal(claimsAvailability.AVAILABLE);
    });
  });

  describe('FETCH_CLAIMS_ERROR', () => {
    it('should set claimsLoading to false and availability to unavailable', () => {
      const existingState = {
        ...initialState,
        claimsLoading: true,
        claims: [{ id: 1 }],
      };

      const state = claimsReducer(existingState, {
        type: FETCH_CLAIMS_ERROR,
      });

      expect(state.claimsLoading).to.be.false;
      expect(state.claimsAvailability).to.equal(claimsAvailability.UNAVAILABLE);
    });

    it('should preserve existing claims data', () => {
      const existingState = {
        ...initialState,
        claims: [{ id: 1 }],
      };

      const state = claimsReducer(existingState, {
        type: FETCH_CLAIMS_ERROR,
      });

      expect(state.claims).to.eql([{ id: 1 }]);
    });

    it('should preserve other state properties', () => {
      const existingState = {
        ...initialState,
        appeals: [{ id: 1 }],
        stemClaims: [{ id: 2 }],
      };

      const state = claimsReducer(existingState, {
        type: FETCH_CLAIMS_ERROR,
      });

      expect(state.appeals).to.eql([{ id: 1 }]);
      expect(state.stemClaims).to.eql([{ id: 2 }]);
    });
  });

  describe('FETCH_APPEALS_PENDING', () => {
    it('should preserve other state properties', () => {
      const existingState = {
        ...initialState,
        claims: [{ id: 1 }],
        claimsLoading: true,
      };

      const state = claimsReducer(existingState, {
        type: FETCH_APPEALS_PENDING,
      });

      expect(state.claims).to.eql([{ id: 1 }]);
      expect(state.claimsLoading).to.be.true;
    });
  });

  describe('FETCH_APPEALS_SUCCESS', () => {
    it('should set appeals data and availability', () => {
      const mockAppeals = [
        { id: '1', type: 'appeal' },
        { id: '2', type: 'supplementalClaim' },
      ];

      const state = claimsReducer(initialState, {
        type: FETCH_APPEALS_SUCCESS,
        appeals: mockAppeals,
      });

      expect(state.appeals).to.eql(mockAppeals);
      expect(state.appealsLoading).to.be.false;
      expect(state.available).to.be.true;
      expect(state.appealsAvailability).to.equal(appealsAvailability.AVAILABLE);
    });

    it('should preserve other state properties', () => {
      const existingState = {
        ...initialState,
        claims: [{ id: 1 }],
        stemClaims: [{ id: 2 }],
      };

      const mockAppeals = [{ id: '1' }];

      const state = claimsReducer(existingState, {
        type: FETCH_APPEALS_SUCCESS,
        appeals: mockAppeals,
      });

      expect(state.claims).to.eql([{ id: 1 }]);
      expect(state.stemClaims).to.eql([{ id: 2 }]);
    });

    it('should handle empty appeals array', () => {
      const state = claimsReducer(initialState, {
        type: FETCH_APPEALS_SUCCESS,
        appeals: [],
      });

      expect(state.appeals).to.eql([]);
      expect(state.appealsLoading).to.be.false;
      expect(state.available).to.be.true;
      expect(state.appealsAvailability).to.equal(appealsAvailability.AVAILABLE);
    });
  });

  describe('USER_FORBIDDEN_ERROR', () => {
    it('should set appealsLoading to false and availability to USER_FORBIDDEN_ERROR', () => {
      const existingState = {
        ...initialState,
        appealsLoading: true,
        appeals: [{ id: 1 }],
      };

      const state = claimsReducer(existingState, {
        type: USER_FORBIDDEN_ERROR,
      });

      expect(state.appealsLoading).to.be.false;
      expect(state.appealsAvailability).to.equal(
        appealsAvailability.USER_FORBIDDEN_ERROR,
      );
    });

    it('should preserve existing appeals data', () => {
      const existingState = {
        ...initialState,
        appeals: [{ id: 1 }],
      };

      const state = claimsReducer(existingState, {
        type: USER_FORBIDDEN_ERROR,
      });

      expect(state.appeals).to.eql([{ id: 1 }]);
    });

    it('should preserve other state properties', () => {
      const existingState = {
        ...initialState,
        claims: [{ id: 1 }],
        stemClaims: [{ id: 2 }],
      };

      const state = claimsReducer(existingState, {
        type: USER_FORBIDDEN_ERROR,
      });

      expect(state.claims).to.eql([{ id: 1 }]);
      expect(state.stemClaims).to.eql([{ id: 2 }]);
    });
  });

  describe('RECORD_NOT_FOUND_ERROR', () => {
    it('should set appealsLoading to false and availability to RECORD_NOT_FOUND_ERROR', () => {
      const existingState = {
        ...initialState,
        appealsLoading: true,
        appeals: [{ id: 1 }],
      };

      const state = claimsReducer(existingState, {
        type: RECORD_NOT_FOUND_ERROR,
      });

      expect(state.appealsLoading).to.be.false;
      expect(state.appealsAvailability).to.equal(
        appealsAvailability.RECORD_NOT_FOUND_ERROR,
      );
    });

    it('should preserve existing appeals data', () => {
      const existingState = {
        ...initialState,
        appeals: [{ id: 1 }],
      };

      const state = claimsReducer(existingState, {
        type: RECORD_NOT_FOUND_ERROR,
      });

      expect(state.appeals).to.eql([{ id: 1 }]);
    });

    it('should preserve other state properties', () => {
      const existingState = {
        ...initialState,
        claims: [{ id: 1 }],
        stemClaims: [{ id: 2 }],
      };

      const state = claimsReducer(existingState, {
        type: RECORD_NOT_FOUND_ERROR,
      });

      expect(state.claims).to.eql([{ id: 1 }]);
      expect(state.stemClaims).to.eql([{ id: 2 }]);
    });
  });

  describe('VALIDATION_ERROR', () => {
    it('should set appealsLoading to false and availability to VALIDATION_ERROR', () => {
      const existingState = {
        ...initialState,
        appealsLoading: true,
        appeals: [{ id: 1 }],
      };

      const state = claimsReducer(existingState, {
        type: VALIDATION_ERROR,
      });

      expect(state.appealsLoading).to.be.false;
      expect(state.appealsAvailability).to.equal(
        appealsAvailability.VALIDATION_ERROR,
      );
    });

    it('should preserve existing appeals data', () => {
      const existingState = {
        ...initialState,
        appeals: [{ id: 1 }],
      };

      const state = claimsReducer(existingState, {
        type: VALIDATION_ERROR,
      });

      expect(state.appeals).to.eql([{ id: 1 }]);
    });

    it('should preserve other state properties', () => {
      const existingState = {
        ...initialState,
        claims: [{ id: 1 }],
        stemClaims: [{ id: 2 }],
      };

      const state = claimsReducer(existingState, {
        type: VALIDATION_ERROR,
      });

      expect(state.claims).to.eql([{ id: 1 }]);
      expect(state.stemClaims).to.eql([{ id: 2 }]);
    });
  });

  describe('BACKEND_SERVICE_ERROR', () => {
    it('should set appealsLoading to false and availability to BACKEND_SERVICE_ERROR', () => {
      const existingState = {
        ...initialState,
        appealsLoading: true,
        appeals: [{ id: 1 }],
      };

      const state = claimsReducer(existingState, {
        type: BACKEND_SERVICE_ERROR,
      });

      expect(state.appealsLoading).to.be.false;
      expect(state.appealsAvailability).to.equal(
        appealsAvailability.BACKEND_SERVICE_ERROR,
      );
    });

    it('should preserve existing appeals data', () => {
      const existingState = {
        ...initialState,
        appeals: [{ id: 1 }],
      };

      const state = claimsReducer(existingState, {
        type: BACKEND_SERVICE_ERROR,
      });

      expect(state.appeals).to.eql([{ id: 1 }]);
    });

    it('should preserve other state properties', () => {
      const existingState = {
        ...initialState,
        claims: [{ id: 1 }],
        stemClaims: [{ id: 2 }],
      };

      const state = claimsReducer(existingState, {
        type: BACKEND_SERVICE_ERROR,
      });

      expect(state.claims).to.eql([{ id: 1 }]);
      expect(state.stemClaims).to.eql([{ id: 2 }]);
    });
  });

  describe('FETCH_APPEALS_ERROR', () => {
    it('should set appealsLoading to false and availability to FETCH_APPEALS_ERROR', () => {
      const existingState = {
        ...initialState,
        appealsLoading: true,
        appeals: [{ id: 1 }],
      };

      const state = claimsReducer(existingState, {
        type: FETCH_APPEALS_ERROR,
      });

      expect(state.appealsLoading).to.be.false;
      expect(state.appealsAvailability).to.equal(
        appealsAvailability.FETCH_APPEALS_ERROR,
      );
    });

    it('should preserve existing appeals data', () => {
      const existingState = {
        ...initialState,
        appeals: [{ id: 1 }],
      };

      const state = claimsReducer(existingState, {
        type: FETCH_APPEALS_ERROR,
      });

      expect(state.appeals).to.eql([{ id: 1 }]);
    });

    it('should preserve other state properties', () => {
      const existingState = {
        ...initialState,
        claims: [{ id: 1 }],
        stemClaims: [{ id: 2 }],
      };

      const state = claimsReducer(existingState, {
        type: FETCH_APPEALS_ERROR,
      });

      expect(state.claims).to.eql([{ id: 1 }]);
      expect(state.stemClaims).to.eql([{ id: 2 }]);
    });
  });

  describe('CHANGE_INDEX_PAGE', () => {
    it('should preserve other state properties', () => {
      const existingState = {
        ...initialState,
        claims: [{ id: 1 }],
        appeals: [{ id: 2 }],
      };

      const state = claimsReducer(existingState, {
        type: CHANGE_INDEX_PAGE,
      });

      expect(state.claims).to.eql([{ id: 1 }]);
      expect(state.appeals).to.eql([{ id: 2 }]);
    });
  });

  describe('FETCH_STEM_CLAIMS_PENDING', () => {
    it('should set stemClaimsLoading to true', () => {
      const state = claimsReducer(initialState, {
        type: FETCH_STEM_CLAIMS_PENDING,
      });

      expect(state.stemClaimsLoading).to.be.true;
    });

    it('should preserve other state properties', () => {
      const existingState = {
        ...initialState,
        claims: [{ id: 1 }],
        appeals: [{ id: 2 }],
      };

      const state = claimsReducer(existingState, {
        type: FETCH_STEM_CLAIMS_PENDING,
      });

      expect(state.claims).to.eql([{ id: 1 }]);
      expect(state.appeals).to.eql([{ id: 2 }]);
      expect(state.stemClaimsLoading).to.be.true;
    });
  });

  describe('FETCH_STEM_CLAIMS_ERROR', () => {
    it('should set stemClaimsLoading to false', () => {
      const existingState = {
        ...initialState,
        stemClaimsLoading: true,
        stemClaims: [{ id: 1 }],
      };

      const state = claimsReducer(existingState, {
        type: FETCH_STEM_CLAIMS_ERROR,
      });

      expect(state.stemClaimsLoading).to.be.false;
    });

    it('should preserve existing stemClaims data', () => {
      const existingState = {
        ...initialState,
        stemClaims: [{ id: 1 }],
      };

      const state = claimsReducer(existingState, {
        type: FETCH_STEM_CLAIMS_ERROR,
      });

      expect(state.stemClaims).to.eql([{ id: 1 }]);
    });

    it('should preserve other state properties', () => {
      const existingState = {
        ...initialState,
        claims: [{ id: 1 }],
        appeals: [{ id: 2 }],
      };

      const state = claimsReducer(existingState, {
        type: FETCH_STEM_CLAIMS_ERROR,
      });

      expect(state.claims).to.eql([{ id: 1 }]);
      expect(state.appeals).to.eql([{ id: 2 }]);
    });
  });

  describe('FETCH_STEM_CLAIMS_SUCCESS', () => {
    it('should set stemClaims data and set loading to false', () => {
      const mockStemClaims = [
        { id: '1', attributes: { claimType: 'stem' } },
        { id: '2', attributes: { claimType: 'stem' } },
      ];

      const existingState = {
        ...initialState,
        stemClaimsLoading: true,
      };

      const state = claimsReducer(existingState, {
        type: FETCH_STEM_CLAIMS_SUCCESS,
        stemClaims: mockStemClaims,
      });

      expect(state.stemClaims).to.eql(mockStemClaims);
      expect(state.stemClaimsLoading).to.be.false;
    });

    it('should preserve other state properties', () => {
      const existingState = {
        ...initialState,
        claims: [{ id: 1 }],
        appeals: [{ id: 2 }],
      };

      const mockStemClaims = [{ id: '1' }];

      const state = claimsReducer(existingState, {
        type: FETCH_STEM_CLAIMS_SUCCESS,
        stemClaims: mockStemClaims,
      });

      expect(state.claims).to.eql([{ id: 1 }]);
      expect(state.appeals).to.eql([{ id: 2 }]);
    });

    it('should handle empty stemClaims array', () => {
      const existingState = {
        ...initialState,
        stemClaimsLoading: true,
      };

      const state = claimsReducer(existingState, {
        type: FETCH_STEM_CLAIMS_SUCCESS,
        stemClaims: [],
      });

      expect(state.stemClaims).to.eql([]);
      expect(state.stemClaimsLoading).to.be.false;
    });
  });

  describe('default case', () => {
    it('should return state unchanged for unknown action types', () => {
      const existingState = {
        ...initialState,
        claims: [{ id: 1 }],
        appeals: [{ id: 2 }],
      };

      const state = claimsReducer(existingState, {
        type: 'UNKNOWN_ACTION_TYPE',
      });

      expect(state).to.eql(existingState);
      expect(state).to.equal(existingState);
    });
  });
});
