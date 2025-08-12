import { expect } from 'chai';
import guide, { initialState } from '../../reducers';
import { ALL_QUESTIONS } from '../../constants';
import { createFormStore } from '../../utilities/answer-storage';
import { RESPONSES } from '../../constants/question-data-map';

const { decisionReviewsGuide } = guide;
const { YES } = RESPONSES;

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

      const currentState = {
        allQuestionShortNames: ALL_QUESTIONS,
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
        allQuestionShortNames: ALL_QUESTIONS,
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
        payload: YES,
      };

      const currentState = {
        allQuestionShortNames: ALL_QUESTIONS,
        form: {
          ...emptyFormStore,
          Q_1_1_CLAIM_DECISION: YES,
        },
        viewedIntroPage: false,
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
