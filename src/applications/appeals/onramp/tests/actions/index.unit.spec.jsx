import { expect } from 'chai';
import sinon from 'sinon-v20';
import * as constants from '../../constants';
import { SHORT_NAME_MAP } from '../../constants/question-data-map';
import { RESULTS_NAME_MAP } from '../../constants/results-data-map';
import {
  FORM_ACTION_TYPES,
  makeQuestionActionTypes,
  updateIntroPageViewed,
  updateFormStore,
  updateQuestionValue,
  updateResultsPage,
} from '../../actions';

const {
  Q_1_1_CLAIM_DECISION,
  Q_1_1A_SUBMITTED_526,
  Q_1_2_CLAIM_DECISION,
} = SHORT_NAME_MAP;

const {
  ONRAMP_VIEWED_INTRO_PAGE,
  ONRAMP_UPDATE_FORM_STORE,
  ONRAMP_UPDATE_RESULTS_PAGE,
} = FORM_ACTION_TYPES;

const { RESULTS_1_1B } = RESULTS_NAME_MAP;

describe('actions', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('makeQuestionActionTypes', () => {
    it('should correctly create all available question action types', () => {
      sinon
        .stub(constants, 'ALL_QUESTIONS')
        .value([
          Q_1_1_CLAIM_DECISION,
          Q_1_1A_SUBMITTED_526,
          Q_1_2_CLAIM_DECISION,
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
        type: ONRAMP_VIEWED_INTRO_PAGE,
        payload: true,
      };

      expect(updateIntroPageViewed(value)).to.deep.equal(expectedAction);
    });
  });

  describe('updateFormStore', () => {
    it('should create an action to update form store', () => {
      const value = { someKey: 'someValue' };
      const expectedAction = {
        type: ONRAMP_UPDATE_FORM_STORE,
        payload: value,
      };

      expect(updateFormStore(value)).to.deep.equal(expectedAction);
    });
  });

  describe('updateQuestionValue', () => {
    it('should create an action to update question value', () => {
      const SHORT_NAME = Q_1_1_CLAIM_DECISION;
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

  describe('updateResultsPage', () => {
    it('should create an action to update results page value', () => {
      const value = RESULTS_1_1B;
      const expectedAction = {
        type: ONRAMP_UPDATE_RESULTS_PAGE,
        payload: value,
      };

      expect(updateResultsPage(value)).to.deep.equal(expectedAction);
    });
  });
});
