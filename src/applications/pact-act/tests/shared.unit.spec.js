import { expect } from 'chai';
import sinon from 'sinon';
import {
  getLastQuestionAnswered,
  getNonNullShortNamesFromStore,
  getServicePeriodResponse,
  onResultsBackClick,
  pushToRoute,
} from '../utilities/shared';
import { RESPONSES, SHORT_NAME_MAP } from '../constants/question-data-map';
import { ROUTES } from '../constants';

const { DURING_BOTH_PERIODS, ENEWETAK_ATOLL, NO, NOT_SURE, YES } = RESPONSES;

const {
  BURN_PIT_2_1,
  BURN_PIT_2_1_1,
  BURN_PIT_2_1_2,
  ORANGE_2_2_1_A,
  ORANGE_2_2_A,
  SERVICE_PERIOD,
} = SHORT_NAME_MAP;

const pushSpy = sinon.spy();

const router = {
  push: pushSpy,
};

beforeEach(() => {
  pushSpy.reset();
});

describe('shared utilities', () => {
  describe('pushToRoute', () => {
    it('should correctly push to the given route', () => {
      pushToRoute(SHORT_NAME_MAP.RADIATION_2_3_A, router);

      expect(pushSpy.firstCall.calledWith(ROUTES.RADIATION_2_3_A)).to.be.true;
    });
  });

  describe('getNonNullShortNamesFromStore', () => {
    it('should correctly return all of the non-null short names from the store', () => {
      const responsesToClean = {
        SERVICE_PERIOD: DURING_BOTH_PERIODS,
        BURN_PIT_2_1: NO,
        BURN_PIT_2_1_1: NOT_SURE,
        BURN_PIT_2_1_2: null,
        ORANGE_2_2_A: null,
        ORANGE_2_2_1_A: null,
      };

      expect(getNonNullShortNamesFromStore(responsesToClean)).to.deep.equal([
        SERVICE_PERIOD,
        BURN_PIT_2_1,
        BURN_PIT_2_1_1,
      ]);
    });

    it('should correctly return all of the non-null short names from the store', () => {
      const responsesToClean = {
        SERVICE_PERIOD: DURING_BOTH_PERIODS,
        BURN_PIT_2_1: NO,
        BURN_PIT_2_1_1: NOT_SURE,
        BURN_PIT_2_1_2: NOT_SURE,
        ORANGE_2_2_A: NOT_SURE,
        ORANGE_2_2_1_A: NOT_SURE,
        RADIATION_2_3_A: null,
        RADIATION_2_3_B: null,
        LEJEUNE_2_4: null,
      };

      expect(getNonNullShortNamesFromStore(responsesToClean)).to.deep.equal([
        SERVICE_PERIOD,
        BURN_PIT_2_1,
        BURN_PIT_2_1_1,
        BURN_PIT_2_1_2,
        ORANGE_2_2_A,
        ORANGE_2_2_1_A,
      ]);
    });
  });

  describe('getLastQuestionAnswered', () => {
    const formResponses = {
      SERVICE_PERIOD: DURING_BOTH_PERIODS,
      BURN_PIT_2_1: NO,
      BURN_PIT_2_1_1: NOT_SURE,
      BURN_PIT_2_1_2: NOT_SURE,
      ORANGE_2_2_A: NOT_SURE,
      ORANGE_2_2_B: null,
      ORANGE_2_2_1_A: NOT_SURE,
      ORANGE_2_2_1_B: null,
      RADIATION_2_3_A: null,
      RADIATION_2_3_B: null,
      LEJEUNE_2_4: null,
    };

    it('should return the last question answered in the flow', () => {
      expect(getLastQuestionAnswered(formResponses)).to.equal(
        SHORT_NAME_MAP.ORANGE_2_2_1_A,
      );
    });
  });

  describe('onResultsBackClick', () => {
    const formResponses = {
      SERVICE_PERIOD: DURING_BOTH_PERIODS,
      BURN_PIT_2_1: NO,
      BURN_PIT_2_1_1: NOT_SURE,
      BURN_PIT_2_1_2: NOT_SURE,
      ORANGE_2_2_A: NOT_SURE,
      ORANGE_2_2_B: null,
      ORANGE_2_2_1_A: NOT_SURE,
      ORANGE_2_2_1_B: null,
      RADIATION_2_3_A: YES,
      RADIATION_2_3_B: [ENEWETAK_ATOLL],
      LEJEUNE_2_4: YES,
    };

    it('should correctly push to the previous question', () => {
      onResultsBackClick(formResponses, router);

      expect(pushSpy.firstCall.calledWith(ROUTES.LEJEUNE_2_4)).to.be.true;
    });
  });

  describe('getServicePeriodResponse', () => {
    it('should return the response when it exists', () => {
      expect(
        getServicePeriodResponse({
          BURN_PIT_2_1: RESPONSES.YES,
          SERVICE_PERIOD: RESPONSES.NINETY_OR_LATER,
        }),
      ).to.equal(RESPONSES.NINETY_OR_LATER);
    });

    it('should return null when the response does not exist', () => {
      expect(
        getServicePeriodResponse({
          BURN_PIT_2_1: RESPONSES.YES,
          SERVICE_PERIOD: null,
        }),
      ).to.equal(null);
    });
  });
});
