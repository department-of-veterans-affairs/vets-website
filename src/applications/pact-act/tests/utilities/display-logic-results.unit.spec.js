import { expect } from 'chai';
import sinon from 'sinon';
import { RESPONSES, SHORT_NAME_MAP } from '../../constants/question-data-map';
import { ROUTES } from '../../constants';
import {
  determineResultsPage,
  responsesMatchResultsDCs,
} from '../../utilities/display-logic-results';
import { BATCHES } from '../../constants/question-batches';
import { NONE } from '../../constants/display-conditions/results-screens';

const pushSpy = sinon.spy();
const updateSpy = sinon.spy();

const router = {
  push: pushSpy,
};

beforeEach(() => {
  pushSpy.reset();
  updateSpy.reset();
});

const {
  BURN_PIT_2_1_1,
  BURN_PIT_2_1_2,
  LEJEUNE_2_4,
  ORANGE_2_2_1_A,
  ORANGE_2_2_2,
  ORANGE_2_2_3,
  RADIATION_2_3_A,
} = SHORT_NAME_MAP;

const {
  DURING_BOTH_PERIODS,
  EIGHTYNINE_OR_EARLIER,
  GREENLAND_THULE,
  NINETY_OR_LATER,
  NO,
  NOT_SURE,
  YES,
} = RESPONSES;

const { ORANGE, BURN_PITS, CAMP_LEJEUNE, RADIATION } = BATCHES;

describe('display conditions for results pages', () => {
  describe('responsesMatchResultsDCs', () => {
    describe('results screen 1 display conditions', () => {
      it('should return true if the display conditions are met', () => {
        const yesShortNames = [BURN_PIT_2_1_1];

        expect(responsesMatchResultsDCs(yesShortNames, { ONLY: [BURN_PITS] }))
          .to.be.true;
      });

      it('should return true if the display conditions are met', () => {
        const yesShortNames = [BURN_PIT_2_1_1, ORANGE_2_2_3, RADIATION_2_3_A];

        expect(
          responsesMatchResultsDCs(yesShortNames, {
            YES: [BURN_PITS, ORANGE, RADIATION],
          }),
        ).to.be.true;
      });

      it('should return true if the display conditions are met', () => {
        const yesShortNames = [BURN_PIT_2_1_1];

        expect(
          responsesMatchResultsDCs(yesShortNames, {
            YES: [BURN_PITS, ORANGE, RADIATION],
          }),
        ).to.be.true;
      });

      it('should return true if the display conditions are met', () => {
        const yesShortNames = [ORANGE_2_2_3, RADIATION_2_3_A];

        expect(
          responsesMatchResultsDCs(yesShortNames, { YES: [ORANGE, RADIATION] }),
        ).to.be.true;
      });

      it('should return true if the display conditions are met', () => {
        const yesShortNames = [RADIATION_2_3_A];

        expect(
          responsesMatchResultsDCs(yesShortNames, { YES: [ORANGE, RADIATION] }),
        ).to.be.true;
      });

      it('should return true if the display conditions are met', () => {
        const yesShortNames = [ORANGE_2_2_2];

        expect(
          responsesMatchResultsDCs(yesShortNames, { YES: [ORANGE, RADIATION] }),
        ).to.be.true;
      });

      it('should return false if the display conditions are not met', () => {
        const yesShortNames = [LEJEUNE_2_4];

        expect(
          responsesMatchResultsDCs(yesShortNames, { YES: [ORANGE, RADIATION] }),
        ).to.be.false;
      });

      it('should return false if the display conditions are not met', () => {
        const yesShortNames = [];

        expect(
          responsesMatchResultsDCs(yesShortNames, { YES: [ORANGE, RADIATION] }),
        ).to.be.false;
      });

      it('should return false if the display conditions are not met', () => {
        const yesShortNames = [LEJEUNE_2_4];

        expect(responsesMatchResultsDCs(yesShortNames, { ONLY: [BURN_PITS] }))
          .to.be.false;
      });

      it('should return false if the display conditions are not met', () => {
        const yesShortNames = [LEJEUNE_2_4];

        expect(
          responsesMatchResultsDCs(yesShortNames, {
            YES: [BURN_PITS, ORANGE, RADIATION],
          }),
        ).to.be.false;
      });

      it('should return false if the display conditions are not met', () => {
        const yesShortNames = [];

        expect(
          responsesMatchResultsDCs(yesShortNames, {
            YES: [BURN_PITS, ORANGE, RADIATION],
          }),
        ).to.be.false;
      });
    });

    describe('results screen 2 display conditions', () => {
      it('should return true if the display conditions are met', () => {
        const yesShortNames = [LEJEUNE_2_4];

        expect(
          responsesMatchResultsDCs(yesShortNames, { ONLY: [CAMP_LEJEUNE] }),
        ).to.be.true;
      });

      it('should return false if the display conditions are not met', () => {
        const yesShortNames = [RADIATION_2_3_A, LEJEUNE_2_4];

        expect(
          responsesMatchResultsDCs(yesShortNames, { ONLY: [CAMP_LEJEUNE] }),
        ).to.be.false;
      });

      it('should return false if the display conditions are not met', () => {
        const yesShortNames = [];

        expect(
          responsesMatchResultsDCs(yesShortNames, { ONLY: [CAMP_LEJEUNE] }),
        ).to.be.false;
      });

      it('should return false if the display conditions are not met', () => {
        const yesShortNames = [BURN_PIT_2_1_1, RADIATION_2_3_A];

        expect(responsesMatchResultsDCs(yesShortNames, { ONLY: [BURN_PITS] }))
          .to.be.false;
      });
    });

    describe('results screen 3 display conditions', () => {
      it('should return true if the display conditions are met', () => {
        const yesShortNames = [];

        expect(responsesMatchResultsDCs(yesShortNames, { YES: NONE })).to.be
          .true;
      });

      it('should return false if the display conditions are not met', () => {
        const yesShortNames = [BURN_PIT_2_1_2];

        expect(responsesMatchResultsDCs(yesShortNames, { YES: NONE })).to.be
          .false;
      });

      it('should return false if the display conditions are not met', () => {
        const yesShortNames = [BURN_PIT_2_1_2, ORANGE_2_2_1_A];

        expect(responsesMatchResultsDCs(yesShortNames, { YES: NONE })).to.be
          .false;
      });
    });
  });

  describe('determineResultsPage', () => {
    describe('results 1', () => {
      it('should return push to results 1 when necessary', () => {
        const formResponses = {
          SERVICE_PERIOD: NINETY_OR_LATER,
          BURN_PIT_2_1: YES,
          BURN_PIT_2_1_1: null,
          BURN_PIT_2_1_2: null,
        };

        determineResultsPage(formResponses, router, updateSpy);
        expect(router.push.firstCall.calledWith(ROUTES.RESULTS_1_1)).to.be.true;
      });

      it('should return push to results 1 when necessary', () => {
        const formResponses = {
          SERVICE_PERIOD: EIGHTYNINE_OR_EARLIER,
          BURN_PIT_2_1: YES,
          BURN_PIT_2_1_1: null,
          BURN_PIT_2_1_2: null,
          ORANGE_2_2_A: NO,
          ORANGE_2_2_B: null,
          ORANGE_2_2_1_A: NO,
          ORANGE_2_2_1_B: null,
          ORANGE_2_2_2: NO,
          RADIATION_2_3_A: YES,
          RADIATION_2_3_B: [GREENLAND_THULE],
          LEJEUNE_2_4: NOT_SURE,
        };

        determineResultsPage(formResponses, router, updateSpy);
        expect(router.push.firstCall.calledWith(ROUTES.RESULTS_1_1)).to.be.true;
      });

      it('should return push to results 1 when necessary', () => {
        const formResponses = {
          SERVICE_PERIOD: DURING_BOTH_PERIODS,
          BURN_PIT_2_1: NO,
          BURN_PIT_2_1_1: YES,
          BURN_PIT_2_1_2: null,
          ORANGE_2_2_A: NO,
          ORANGE_2_2_B: null,
          ORANGE_2_2_1_A: NO,
          ORANGE_2_2_1_B: null,
          ORANGE_2_2_2: YES,
          RADIATION_2_3_A: YES,
          RADIATION_2_3_B: [GREENLAND_THULE],
          LEJEUNE_2_4: NOT_SURE,
        };

        determineResultsPage(formResponses, router, updateSpy);
        expect(router.push.firstCall.calledWith(ROUTES.RESULTS_1_1)).to.be.true;
      });
    });

    describe('results 2', () => {
      it('should return push to results 2 when necessary', () => {
        const formResponses = {
          SERVICE_PERIOD: EIGHTYNINE_OR_EARLIER,
          BURN_PIT_2_1: NO,
          BURN_PIT_2_1_1: NOT_SURE,
          BURN_PIT_2_1_2: NOT_SURE,
          ORANGE_2_2_A: NO,
          ORANGE_2_2_B: null,
          ORANGE_2_2_1_A: NO,
          ORANGE_2_2_1_B: null,
          ORANGE_2_2_2: NO,
          RADIATION_2_3_A: NO,
          RADIATION_2_3_B: null,
          LEJEUNE_2_4: YES,
        };

        determineResultsPage(formResponses, router, updateSpy);
        expect(router.push.firstCall.calledWith(ROUTES.RESULTS_2)).to.be.true;
      });

      it('should return push to results 2 when necessary', () => {
        const formResponses = {
          SERVICE_PERIOD: DURING_BOTH_PERIODS,
          BURN_PIT_2_1: NOT_SURE,
          BURN_PIT_2_1_1: NO,
          BURN_PIT_2_1_2: NO,
          ORANGE_2_2_A: NO,
          ORANGE_2_2_B: null,
          ORANGE_2_2_1_A: NOT_SURE,
          ORANGE_2_2_1_B: null,
          ORANGE_2_2_2: NO,
          RADIATION_2_3_A: NO,
          RADIATION_2_3_B: null,
          LEJEUNE_2_4: YES,
        };

        determineResultsPage(formResponses, router, updateSpy);
        expect(router.push.firstCall.calledWith(ROUTES.RESULTS_2)).to.be.true;
      });
    });

    describe('results 3', () => {
      it('should return push to results 3 when necessary', () => {
        const formResponses = {
          SERVICE_PERIOD: NINETY_OR_LATER,
          BURN_PIT_2_1: NO,
          BURN_PIT_2_1_1: NOT_SURE,
          BURN_PIT_2_1_2: NO,
        };

        determineResultsPage(formResponses, router, updateSpy);
        expect(router.push.firstCall.calledWith(ROUTES.RESULTS_3)).to.be.true;
      });

      it('should return push to results 3 when necessary', () => {
        const formResponses = {
          SERVICE_PERIOD: EIGHTYNINE_OR_EARLIER,
          BURN_PIT_2_1: NO,
          BURN_PIT_2_1_1: NOT_SURE,
          BURN_PIT_2_1_2: NOT_SURE,
          ORANGE_2_2_A: NO,
          ORANGE_2_2_B: null,
          ORANGE_2_2_1_A: NO,
          ORANGE_2_2_1_B: null,
          ORANGE_2_2_2: NO,
          RADIATION_2_3_A: NO,
          RADIATION_2_3_B: null,
          LEJEUNE_2_4: NO,
        };

        determineResultsPage(formResponses, router, updateSpy);
        expect(router.push.firstCall.calledWith(ROUTES.RESULTS_3)).to.be.true;
      });

      it('should return push to results 3 when necessary', () => {
        const formResponses = {
          SERVICE_PERIOD: DURING_BOTH_PERIODS,
          BURN_PIT_2_1: NOT_SURE,
          BURN_PIT_2_1_1: NO,
          BURN_PIT_2_1_2: NO,
          ORANGE_2_2_A: NO,
          ORANGE_2_2_B: null,
          ORANGE_2_2_1_A: NOT_SURE,
          ORANGE_2_2_1_B: null,
          ORANGE_2_2_2: NO,
          RADIATION_2_3_A: NO,
          RADIATION_2_3_B: null,
          LEJEUNE_2_4: NO,
        };

        determineResultsPage(formResponses, router, updateSpy);
        expect(router.push.firstCall.calledWith(ROUTES.RESULTS_3)).to.be.true;
      });
    });
  });
});
