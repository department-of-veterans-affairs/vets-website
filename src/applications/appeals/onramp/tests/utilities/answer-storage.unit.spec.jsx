import { expect } from 'chai';
import sinon from 'sinon-v20';
import {
  cleanUpAnswers,
  createFormStore,
  setShortNameValue,
} from '../../utilities/answer-storage';
import { RESPONSES } from '../../constants/question-data-map';

const updateCleanedFormStoreSpy = sinon.spy();
const { YES } = RESPONSES;

describe('answer storage utilities', () => {
  beforeEach(() => {
    updateCleanedFormStoreSpy.resetHistory();
  });

  describe('createFormStore', () => {
    it('should properly handle an empty value', () => {
      expect(createFormStore({})).to.deep.equal({});
    });

    it('should create a form store with all questions initialized to null', () => {
      const ALL_QUESTIONS = ['Q_1_1_CLAIM_DECISION', 'Q_1_2_CLAIM_DECISION'];
      const expectedStore = {
        Q_1_1_CLAIM_DECISION: null,
        Q_1_2_CLAIM_DECISION: null,
      };

      expect(createFormStore(ALL_QUESTIONS)).to.deep.equal(expectedStore);
    });
  });

  describe('setShortNameValue', () => {
    it('should return a new state with the updated value for the given short name', () => {
      const state = {
        form: {
          Q_1_1_CLAIM_DECISION: null,
          CLAIM_TIMELINE_1_2: null,
        },
      };

      const SHORT_NAME = 'Q_1_1_CLAIM_DECISION';

      expect(setShortNameValue(SHORT_NAME, state, YES)).to.deep.equal({
        ...state,
        form: {
          ...state.form,
          Q_1_1_CLAIM_DECISION: YES,
        },
      });
    });
  });

  describe('cleanUpAnswers', () => {
    it('should properly clean up the answers after the current question', () => {
      const ALL_QUESTIONS = [
        'Q_1_1_CLAIM_DECISION',
        'Q_1_1A_SUBMITTED_526',
        'Q_1_2_CLAIM_DECISION',
        'Q_1_2A_CONDITION_WORSENED',
        'Q_1_2B_LAW_POLICY_CHANGE',
        'Q_1_2C_NEW_EVIDENCE',
      ];

      cleanUpAnswers(
        ALL_QUESTIONS,
        updateCleanedFormStoreSpy,
        'Q_1_1A_SUBMITTED_526',
      );

      expect(updateCleanedFormStoreSpy.calledOnce).to.be.true;
      expect(updateCleanedFormStoreSpy.firstCall.args[0]).to.deep.equal({
        Q_1_2_CLAIM_DECISION: null,
        Q_1_2A_CONDITION_WORSENED: null,
        Q_1_2B_LAW_POLICY_CHANGE: null,
        Q_1_2C_NEW_EVIDENCE: null,
      });
    });
  });
});
