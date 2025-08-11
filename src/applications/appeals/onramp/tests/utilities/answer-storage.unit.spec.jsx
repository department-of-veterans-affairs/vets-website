import { expect } from 'chai';
import {
  createFormStore,
  setShortNameValue,
} from '../../utilities/answer-storage';

describe('answer storage utilities', () => {
  describe('createFormStore', () => {
    it('should properly handle an empty value', () => {
      expect(createFormStore({})).to.deep.equal({});
    });

    it('should create a form store with all questions initialized to null', () => {
      const ALL_QUESTIONS = ['Q_1_1_CLAIM_DECISION', 'CLAIM_TIMELINE_1_2'];
      const expectedStore = {
        Q_1_1_CLAIM_DECISION: null,
        CLAIM_TIMELINE_1_2: null,
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

      expect(setShortNameValue(SHORT_NAME, state, 'Yes')).to.deep.equal({
        ...state,
        form: {
          ...state.form,
          Q_1_1_CLAIM_DECISION: 'Yes',
        },
      });
    });
  });
});
