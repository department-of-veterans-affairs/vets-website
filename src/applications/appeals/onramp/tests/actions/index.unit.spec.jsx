import { expect } from 'chai';
import sinon from 'sinon-v20';
import * as constants from '../../constants';
import {
  makeQuestionActionTypes,
  updateIntroPageViewed,
  updateFormStore,
  updateQuestionValue,
} from '../../actions';

describe('actions', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('makeQuestionActionTypes', () => {
    it('should correctly create all available question action types', () => {
      sinon
        .stub(constants, 'ALL_QUESTIONS')
        .value([
          'Q_1_1_CLAIM_DECISION',
          'Q_1_1A_SUBMITTED_526',
          'Q_1_2_CLAIM_DECISION',
        ]);

      expect(makeQuestionActionTypes()).to.deep.equal({
        ONRAMP_UPDATE_Q_1_1_CLAIM_DECISION:
          'ONRAMP_UPDATE_Q_1_1_CLAIM_DECISION',
        ONRAMP_UPDATE_Q_1_1A_SUBMITTED_526:
          'ONRAMP_UPDATE_Q_1_1A_SUBMITTED_526',
        ONRAMP_UPDATE_Q_1_2_CLAIM_DECISION:
          'ONRAMP_UPDATE_Q_1_2_CLAIM_DECISION',
      });
    });
  });

  describe('updateIntroPageViewed', () => {
    it('should create an action to update intro page viewed', () => {
      const value = true;
      const expectedAction = {
        type: 'ONRAMP_VIEWED_INTRO_PAGE',
        payload: true,
      };

      expect(updateIntroPageViewed(value)).to.deep.equal(expectedAction);
    });
  });

  describe('updateFormStore', () => {
    it('should create an action to update form store', () => {
      const value = { someKey: 'someValue' };
      const expectedAction = {
        type: 'ONRAMP_UPDATE_FORM_STORE',
        payload: value,
      };

      expect(updateFormStore(value)).to.deep.equal(expectedAction);
    });
  });

  describe('updateQuestionValue', () => {
    it('should create an action to update question value', () => {
      const SHORT_NAME = 'Q_1_1_CLAIM_DECISION';
      const value = 'someValue';
      const expectedAction = {
        type: 'ONRAMP_UPDATE_Q_1_1_CLAIM_DECISION',
        payload: value,
      };

      expect(updateQuestionValue(SHORT_NAME, value)).to.deep.equal(
        expectedAction,
      );
    });
  });
});
