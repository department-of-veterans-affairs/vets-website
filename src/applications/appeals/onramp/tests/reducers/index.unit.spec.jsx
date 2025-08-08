import { expect } from 'chai';
import guide, { initialState } from '../../reducers';

const { decisionReviewsGuide } = guide;

describe('reducer', () => {
  describe('decisionReviewsGuide', () => {
    const allQuestionShortNames = [
      'Q_1_1_CLAIM_DECISION',
      'Q_1_1A_SUBMITTED_526',
      'Q_1_2_CLAIM_DECISION',
      'Q_1_2A_CONDITION_WORSENED',
      'Q_1_2B_LAW_POLICY_CHANGE',
      'Q_1_2C_NEW_EVIDENCE',
      'Q_1_3_CLAIM_CONTESTED',
      'Q_1_3A_FEWER_60_DAYS',
      'Q_2_0_CLAIM_TYPE',
      'Q_2_IS_1_SERVICE_CONNECTED',
      'Q_2_IS_2_CONDITION_WORSENED',
      'Q_2_IS_1A_LAW_POLICY_CHANGE',
      'Q_2_IS_1B_NEW_EVIDENCE',
      'Q_2_S_1_NEW_EVIDENCE',
      'Q_2_H_1_EXISTING_BOARD_APPEAL',
      'Q_2_H_2_NEW_EVIDENCE',
      'Q_2_H_2A_JUDGE_HEARING',
      'Q_2_H_2B_JUDGE_HEARING',
    ];

    const emptyFormStore = {
      Q_1_1_CLAIM_DECISION: null,
      Q_1_1A_SUBMITTED_526: null,
      Q_1_2_CLAIM_DECISION: null,
      Q_1_2A_CONDITION_WORSENED: null,
      Q_1_2B_LAW_POLICY_CHANGE: null,
      Q_1_2C_NEW_EVIDENCE: null,
      Q_1_3_CLAIM_CONTESTED: null,
      Q_1_3A_FEWER_60_DAYS: null,
      Q_2_0_CLAIM_TYPE: null,
      Q_2_IS_1_SERVICE_CONNECTED: null,
      Q_2_IS_2_CONDITION_WORSENED: null,
      Q_2_IS_1A_LAW_POLICY_CHANGE: null,
      Q_2_IS_1B_NEW_EVIDENCE: null,
      Q_2_S_1_NEW_EVIDENCE: null,
      Q_2_H_1_EXISTING_BOARD_APPEAL: null,
      Q_2_H_2_NEW_EVIDENCE: null,
      Q_2_H_2A_JUDGE_HEARING: null,
      Q_2_H_2B_JUDGE_HEARING: null,
    };

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

      const currentState = {
        allQuestionShortNames,
        form: emptyFormStore,
        viewedIntroPage: true,
      };

      expect(decisionReviewsGuide(currentState, action)).to.deep.equal(
        currentState,
      );
    });

    it('should handle ONRAMP_VIEWED_INTRO_PAGE action', () => {
      const action = {
        type: 'ONRAMP_VIEWED_INTRO_PAGE',
        payload: true,
      };

      const expectedState = {
        allQuestionShortNames,
        form: emptyFormStore,
        viewedIntroPage: true,
      };

      expect(decisionReviewsGuide(undefined, action)).to.deep.equal(
        expectedState,
      );
    });

    it('should handle ONRAMP_UPDATE_Q_1_1A_SUBMITTED_526 action', () => {
      const action = {
        type: 'ONRAMP_UPDATE_Q_1_1A_SUBMITTED_526',
        payload: 'Yes',
      };

      const currentState = {
        allQuestionShortNames,
        form: {
          ...emptyFormStore,
          Q_1_1_CLAIM_DECISION: 'Yes',
        },
        viewedIntroPage: false,
      };

      const expectedState = {
        ...currentState,
        form: {
          ...currentState.form,
          Q_1_1A_SUBMITTED_526: 'Yes',
        },
        viewedIntroPage: false,
      };

      expect(decisionReviewsGuide(currentState, action)).to.deep.equal(
        expectedState,
      );
    });
  });
});
