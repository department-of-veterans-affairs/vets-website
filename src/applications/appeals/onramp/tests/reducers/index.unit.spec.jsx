import { expect } from 'chai';
import guide, { initialState } from '../../reducers';
import { FORM_ACTION_TYPES } from '../../actions';
import { ALL_QUESTIONS, ALL_RESULTS } from '../../constants';
import { createFormStore } from '../../utilities/answer-storage';
import { RESPONSES } from '../../constants/question-data-map';

const { decisionReviewsGuide } = guide;
const { YES } = RESPONSES;
const {
  ONRAMP_VIEWED_INTRO_PAGE,
  ONRAMP_UPDATE_FORM_STORE,
  ONRAMP_UPDATE_RESULTS_PAGE,
} = FORM_ACTION_TYPES;
const { RESULTS_1_1B } = ALL_RESULTS;

describe('reducer', () => {
  describe('decisionReviewsGuide', () => {
    const emptyFormStore = createFormStore(ALL_QUESTIONS);

    it('should return the current state for an undefined action', () => {
      expect(decisionReviewsGuide(undefined, {})).to.deep.equal(initialState);
    });

    it('should return the current state for an unrelated (outside the app) action', () => {
      const action = {
        type: 'UNRELATED_ACTION',
      };

      expect(decisionReviewsGuide(undefined, action)).to.deep.equal(
        initialState,
      );
    });

    it('should return the current state for an onramp action that does not exist', () => {
      const action = {
        type: 'ONRAMP_UNKNOWN_ACTION',
      };

      expect(decisionReviewsGuide(initialState, action)).to.deep.equal(
        initialState,
      );
    });

    it('should handle ONRAMP_VIEWED_INTRO_PAGE action', () => {
      const action = {
        type: ONRAMP_VIEWED_INTRO_PAGE,
        payload: true,
      };

      const expectedState = {
        ...initialState,
        viewedIntroPage: true,
      };

      expect(decisionReviewsGuide(initialState, action)).to.deep.equal(
        expectedState,
      );
    });

    it('should handle ONRAMP_UPDATE_FORM_STORE action', () => {
      const action = {
        type: ONRAMP_UPDATE_FORM_STORE,
        payload: {
          Q_1_2C_NEW_EVIDENCE: null,
          Q_1_3_CLAIM_CONTESTED: null,
        },
      };

      const currentState = {
        ...initialState,
        form: {
          ...initialState.form,
          Q_1_2C_NEW_EVIDENCE: YES,
          Q_1_3_CLAIM_CONTESTED: YES,
        },
      };

      const expectedState = {
        ...initialState,
        form: {
          ...initialState.form,
          Q_1_2C_NEW_EVIDENCE: null,
          Q_1_3_CLAIM_CONTESTED: null,
        },
      };

      expect(decisionReviewsGuide(currentState, action)).to.deep.equal(
        expectedState,
      );
    });

    it('should handle ONRAMP_UPDATE_RESULTS_PAGE action', () => {
      const action = {
        type: ONRAMP_UPDATE_RESULTS_PAGE,
        payload: RESULTS_1_1B,
      };

      const expectedState = {
        ...initialState,
        resultPage: RESULTS_1_1B,
      };

      expect(decisionReviewsGuide(initialState, action)).to.deep.equal(
        expectedState,
      );
    });

    it('should handle ONRAMP_UPDATE_Q_1_1A_SUBMITTED_526 action', () => {
      const action = {
        type: 'ONRAMP_UPDATE_Q_1_1A_SUBMITTED_526',
        payload: YES,
      };

      const currentState = {
        ...initialState,
        form: {
          ...emptyFormStore,
          Q_1_1_CLAIM_DECISION: YES,
        },
      };

      const expectedState = {
        ...currentState,
        form: {
          ...currentState.form,
          Q_1_1A_SUBMITTED_526: YES,
        },
        viewedIntroPage: false,
      };

      expect(decisionReviewsGuide(currentState, action)).to.deep.equal(
        expectedState,
      );
    });
  });
});
