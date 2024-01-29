import { expect } from 'chai';
import sinon from 'sinon';
import {
  filterForYesResponses,
  getLastQuestionAnswered,
  getNonNullShortNamesFromStore,
  getQuestionBatch,
  getServicePeriodResponse,
  onResultsBackClick,
  pushToRoute,
} from '../../utilities/shared';
import { RESPONSES, SHORT_NAME_MAP } from '../../constants/question-data-map';
import { ROUTES } from '../../constants';
import { BATCHES } from '../../constants/question-batches';

const {
  DURING_BOTH_PERIODS,
  ENEWETAK_ATOLL,
  NINETY_OR_LATER,
  NO,
  NOT_SURE,
  VIETNAM_REP,
  VIETNAM_WATERS,
  YES,
} = RESPONSES;

const {
  BURN_PIT_2_1,
  BURN_PIT_2_1_1,
  BURN_PIT_2_1_2,
  ORANGE_2_2_A,
  ORANGE_2_2_1_A,
  SERVICE_PERIOD,
} = SHORT_NAME_MAP;

const pushSpy = sinon.spy();
const updateSpy = sinon.spy();

const router = {
  push: pushSpy,
};

beforeEach(() => {
  pushSpy.reset();
  updateSpy.reset();
});

describe('shared utilities', () => {
  describe('getQuestionBatch', () => {
    it('should return the correct batch for a given SHORT_NAME', () => {
      expect(getQuestionBatch(SHORT_NAME_MAP.ORANGE_2_2_1_A)).to.equal(
        BATCHES.ORANGE,
      );
    });

    it('should return the correct batch for a given SHORT_NAME', () => {
      expect(getQuestionBatch(SHORT_NAME_MAP.RADIATION_2_3_B)).to.equal(
        BATCHES.RADIATION,
      );
    });
  });

  describe('pushToRoute', () => {
    it('should correctly push to the given route', () => {
      pushToRoute(SHORT_NAME_MAP.RADIATION_2_3_A, router);

      expect(pushSpy.firstCall.calledWith(ROUTES.RADIATION_2_3_A)).to.be.true;
    });
  });

  describe('filterForYesResponses', () => {
    it('should return the correct array of "Yes" responses', () => {
      const formResponses = {
        BURN_PIT_2_1: YES,
        BURN_PIT_2_1_1: null,
        BURN_PIT_2_1_2: null,
        ORANGE_2_2_A: YES,
        ORANGE_2_2_B: [VIETNAM_REP, VIETNAM_WATERS],
        ORANGE_2_2_1_A: NO,
        ORANGE_2_2_1_B: null,
        ORANGE_2_2_2: NO,
        SERVICE_PERIOD: DURING_BOTH_PERIODS,
      };

      expect(filterForYesResponses(formResponses)).to.deep.equal([
        BURN_PIT_2_1,
        ORANGE_2_2_A,
      ]);
    });

    it('should return the correct array of "Yes" responses', () => {
      const formResponses = {
        BURN_PIT_2_1: NOT_SURE,
        BURN_PIT_2_1_1: YES,
        BURN_PIT_2_1_2: null,
        SERVICE_PERIOD: NINETY_OR_LATER,
      };

      expect(filterForYesResponses(formResponses)).to.deep.equal([
        BURN_PIT_2_1_1,
      ]);
    });

    it('should return the correct array of "Yes" responses', () => {
      const formResponses = {
        BURN_PIT_2_1: NOT_SURE,
        BURN_PIT_2_1_1: NO,
        BURN_PIT_2_1_2: NO,
        ORANGE_2_2_A: NO,
        ORANGE_2_2_B: null,
        ORANGE_2_2_1_A: NO,
        ORANGE_2_2_1_B: null,
        ORANGE_2_2_2: NO,
        RADIATION_2_3_A: NOT_SURE,
        LEJEUNE_2_4: NOT_SURE,
        SERVICE_PERIOD: DURING_BOTH_PERIODS,
      };

      expect(filterForYesResponses(formResponses)).to.deep.equal([]);
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
      onResultsBackClick(formResponses, router, updateSpy);

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
