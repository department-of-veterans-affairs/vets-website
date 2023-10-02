import { expect } from 'chai';
import sinon from 'sinon';
import {
  checkResponses,
  evaluateNestedAndForkedDCs,
  evaluateOneOfChoices,
  navigateBackward,
  navigateForward,
  responseMatchesRequired,
} from '../utilities/display-logic';
import { ROUTES } from '../constants';
import { RESPONSES, SHORT_NAME_MAP } from '../constants/question-data-map';

// displayConditionsMet is tested for every question within their respective file (e.g. BurnPit-2-1-1.unit.spec.js)

describe('utils: display logic', () => {
  describe('responseMatchesRequired', () => {
    it('should return true when the response matches the required for an array of choices', () => {
      expect(
        responseMatchesRequired(
          [RESPONSES.NO, RESPONSES.NOT_SURE],
          RESPONSES.NO,
        ),
      ).to.be.true;
    });

    it('should return true when the response matches the required for an array of choices', () => {
      expect(responseMatchesRequired([RESPONSES.YES], RESPONSES.YES)).to.be
        .true;
    });

    it('should return false when the response does not match the required for an array of choices', () => {
      expect(responseMatchesRequired([RESPONSES.YES], RESPONSES.NO)).to.be
        .false;
    });
  });

  describe('evaluateOneOfChoices', () => {
    it('should return true when the response matches the required for an object of choices', () => {
      const formResponses = {
        BURN_PIT_2_1: RESPONSES.YES,
        BURN_PIT_2_1_1: RESPONSES.YES,
      };

      expect(
        evaluateOneOfChoices(
          {
            BURN_PIT_2_1: [RESPONSES.YES],
            BURN_PIT_2_1_1: [RESPONSES.YES],
          },
          formResponses,
        ),
      ).to.be.true;
    });
  });

  describe('checkResponses', () => {
    it('should return true when all the display conditions are met', () => {
      const displayConditionsForPath = {
        BURN_PIT_2_1: [RESPONSES.YES],
        BURN_PIT_2_1_1: [RESPONSES.YES],
        ORANGE_2_2_A: [RESPONSES.NOT_SURE],
        ORANGE_2_2_1_A: [RESPONSES.NO],
        ORANGE_2_2_2: [RESPONSES.NOT_SURE],
      };

      const formResponses = {
        BURN_PIT_2_1: RESPONSES.YES,
        BURN_PIT_2_1_1: RESPONSES.YES,
        ORANGE_2_2_A: RESPONSES.NOT_SURE,
        ORANGE_2_2_1_A: RESPONSES.NO,
        ORANGE_2_2_2: RESPONSES.NOT_SURE,
      };

      expect(checkResponses(formResponses, displayConditionsForPath)).to.be
        .true;
    });

    it('should return false when all the display conditions are not met', () => {
      const displayConditionsForPath = {
        BURN_PIT_2_1: [RESPONSES.YES],
        BURN_PIT_2_1_1: [RESPONSES.NO],
        ORANGE_2_2_A: [RESPONSES.NOT_SURE],
        ORANGE_2_2_1_A: [RESPONSES.NO],
        ORANGE_2_2_2: [RESPONSES.YES],
      };

      const formResponses = {
        BURN_PIT_2_1: RESPONSES.YES,
        BURN_PIT_2_1_1: RESPONSES.YES,
        ORANGE_2_2_A: null,
        ORANGE_2_2_1_A: RESPONSES.NO,
        ORANGE_2_2_2: RESPONSES.NOT_SURE,
      };

      expect(checkResponses(formResponses, displayConditionsForPath)).to.be
        .false;
    });
  });

  describe('evaluateNestedAndForkedDCs', () => {
    it('should return true if the short display conditions are met', () => {
      const displayConditionsForPath = {
        SHORT: {
          SERVICE_PERIOD: [RESPONSES.DURING_BOTH_PERIODS],
          ONE_OF: {
            BURN_PIT_2_1: [RESPONSES.YES],
            BURN_PIT_2_1_1: [RESPONSES.YES],
          },
          ORANGE_2_2_A: [RESPONSES.NO, RESPONSES.NOT_SURE],
          ORANGE_2_2_1_A: [RESPONSES.NO, RESPONSES.NOT_SURE],
          ORANGE_2_2_2: [RESPONSES.NO, RESPONSES.NOT_SURE],
        },
        LONG: {
          SERVICE_PERIOD: [RESPONSES.EIGHTYNINE_OR_EARLIER],
        },
      };

      const formResponses = {
        SERVICE_PERIOD: RESPONSES.DURING_BOTH_PERIODS,
        BURN_PIT_2_1: RESPONSES.YES,
        BURN_PIT_2_1_1: RESPONSES.YES,
        ORANGE_2_2_A: RESPONSES.NOT_SURE,
        ORANGE_2_2_1_A: RESPONSES.NO,
        ORANGE_2_2_2: RESPONSES.NOT_SURE,
      };

      expect(
        evaluateNestedAndForkedDCs(formResponses, displayConditionsForPath),
      ).to.be.true;
    });

    it('should return true if the long display conditions are met', () => {
      const displayConditionsForPath = {
        SHORT: {
          SERVICE_PERIOD: [RESPONSES.NINETY_OR_LATER],
        },
        LONG: {
          SERVICE_PERIOD: [RESPONSES.DURING_BOTH_PERIODS],
          BURN_PIT_2_1: [RESPONSES.NO, RESPONSES.NOT_SURE],
          BURN_PIT_2_1_1: [RESPONSES.NO, RESPONSES.NOT_SURE],
        },
      };

      const formResponses = {
        SERVICE_PERIOD: RESPONSES.DURING_BOTH_PERIODS,
        BURN_PIT_2_1: RESPONSES.NO,
        BURN_PIT_2_1_1: RESPONSES.NOT_SURE,
      };

      expect(
        evaluateNestedAndForkedDCs(formResponses, displayConditionsForPath),
      ).to.be.true;
    });

    it('should return false if the short display conditions are not met', () => {
      const displayConditionsForPath = {
        SHORT: {
          SERVICE_PERIOD: [RESPONSES.DURING_BOTH_PERIODS],
          ONE_OF: {
            BURN_PIT_2_1: [RESPONSES.YES],
            BURN_PIT_2_1_1: [RESPONSES.YES],
          },
          ORANGE_2_2_A: [RESPONSES.NO, RESPONSES.NOT_SURE],
        },
        LONG: {
          SERVICE_PERIOD: [RESPONSES.EIGHTYNINE_OR_EARLIER],
        },
      };

      const formResponses = {
        SERVICE_PERIOD: RESPONSES.DURING_BOTH_PERIODS,
        BURN_PIT_2_1: null,
        BURN_PIT_2_1_1: RESPONSES.NO,
        ORANGE_2_2_A: RESPONSES.NOT_SURE,
      };

      expect(
        evaluateNestedAndForkedDCs(formResponses, displayConditionsForPath),
      ).to.be.false;
    });

    it('should return false if the long display conditions are not met', () => {
      const displayConditionsForPath = {
        SHORT: {
          SERVICE_PERIOD: [RESPONSES.NINETY_OR_LATER],
        },
        LONG: {
          SERVICE_PERIOD: [RESPONSES.DURING_BOTH_PERIODS],
          ONE_OF: {
            BURN_PIT_2_1: [RESPONSES.NO],
            BURN_PIT_2_1_1: [RESPONSES.NO],
          },
          ORANGE_2_2_A: [RESPONSES.NO, RESPONSES.YES, RESPONSES.NOT_SURE],
        },
      };

      const formResponses = {
        SERVICE_PERIOD: RESPONSES.DURING_BOTH_PERIODS,
        BURN_PIT_2_1: RESPONSES.YES,
        BURN_PIT_2_1_1: RESPONSES.YES,
        ORANGE_2_2_A: null,
      };

      expect(
        evaluateNestedAndForkedDCs(formResponses, displayConditionsForPath),
      ).to.be.false;
    });

    it('should return true if simple display conditions are met', () => {
      const displayConditionsForPath = {
        SERVICE_PERIOD: [RESPONSES.DURING_BOTH_PERIODS],
        BURN_PIT_2_1: [RESPONSES.NO, RESPONSES.NOT_SURE],
        BURN_PIT_2_1_1: [RESPONSES.NO, RESPONSES.NOT_SURE],
        BURN_PIT_2_1_2: [RESPONSES.YES, RESPONSES.NO, RESPONSES.NOT_SURE],
        ORANGE_2_2_A: [RESPONSES.NO, RESPONSES.NOT_SURE],
        ORANGE_2_2_1_A: [RESPONSES.NO, RESPONSES.NOT_SURE],
      };

      const formResponses = {
        SERVICE_PERIOD: RESPONSES.DURING_BOTH_PERIODS,
        BURN_PIT_2_1: RESPONSES.NO,
        BURN_PIT_2_1_1: RESPONSES.NO,
        BURN_PIT_2_1_2: RESPONSES.NO,
        ORANGE_2_2_A: RESPONSES.NOT_SURE,
        ORANGE_2_2_1_A: RESPONSES.NOT_SURE,
      };

      expect(
        evaluateNestedAndForkedDCs(formResponses, displayConditionsForPath),
      ).to.be.true;
    });

    it('should return false if simple display conditions are not met', () => {
      const displayConditionsForPath = {
        SERVICE_PERIOD: [RESPONSES.DURING_BOTH_PERIODS],
        BURN_PIT_2_1: [RESPONSES.NO, RESPONSES.NOT_SURE],
        BURN_PIT_2_1_1: [RESPONSES.NO, RESPONSES.NOT_SURE],
        BURN_PIT_2_1_2: [RESPONSES.YES, RESPONSES.NO, RESPONSES.NOT_SURE],
        ORANGE_2_2_A: [RESPONSES.NO, RESPONSES.NOT_SURE],
        ORANGE_2_2_1_A: [RESPONSES.NO, RESPONSES.NOT_SURE],
      };

      const formResponses = {
        SERVICE_PERIOD: RESPONSES.DURING_BOTH_PERIODS,
        BURN_PIT_2_1: RESPONSES.NO,
        BURN_PIT_2_1_1: RESPONSES.NO,
        BURN_PIT_2_1_2: RESPONSES.NO,
        ORANGE_2_2_A: null,
        ORANGE_2_2_1_A: null,
      };

      expect(
        evaluateNestedAndForkedDCs(formResponses, displayConditionsForPath),
      ).to.be.false;
    });
  });

  describe('navigateForward', () => {
    describe('routing to BURN_PIT_2_1', () => {
      const formResponses = {
        SERVICE_PERIOD: RESPONSES.NINETY_OR_LATER,
        BURN_PIT_2_1: null,
      };

      const router = {
        push: sinon.spy(),
      };

      it('SERVICE_PERIOD: should correctly route to the next question', () => {
        navigateForward(SHORT_NAME_MAP.SERVICE_PERIOD, formResponses, router);
        expect(router.push.firstCall.calledWith(ROUTES.BURN_PIT_2_1)).to.be
          .true;
      });
    });

    describe('routing to BURN_PIT_2_1_2', () => {
      const formResponses = {
        SERVICE_PERIOD: RESPONSES.DURING_BOTH_PERIODS,
        BURN_PIT_2_1: RESPONSES.NO,
        BURN_PIT_2_1_1: RESPONSES.NOT_SURE,
      };

      const router = {
        push: sinon.spy(),
      };

      it('BURN_PIT_2_1_1: should correctly route to the next question', () => {
        navigateForward(SHORT_NAME_MAP.BURN_PIT_2_1_1, formResponses, router);
        expect(router.push.firstCall.calledWith(ROUTES.BURN_PIT_2_1_2)).to.be
          .true;
      });
    });

    describe('routing to ORANGE_2_2_A', () => {
      const formResponses = {
        SERVICE_PERIOD: RESPONSES.DURING_BOTH_PERIODS,
        BURN_PIT_2_1: RESPONSES.NO,
        BURN_PIT_2_1_1: RESPONSES.NOT_SURE,
        BURN_PIT_2_1_2: RESPONSES.NOT_SURE,
      };

      const router = {
        push: sinon.spy(),
      };

      it('BURN_PIT_2_1_2: should correctly route to the next question', () => {
        navigateForward(SHORT_NAME_MAP.BURN_PIT_2_1_2, formResponses, router);
        expect(router.push.firstCall.calledWith(ROUTES.ORANGE_2_2_A)).to.be
          .true;
      });
    });

    describe('routing to ORANGE_2_2_2', () => {
      const formResponses = {
        SERVICE_PERIOD: RESPONSES.DURING_BOTH_PERIODS,
        BURN_PIT_2_1: RESPONSES.NO,
        BURN_PIT_2_1_1: RESPONSES.NOT_SURE,
        BURN_PIT_2_1_2: RESPONSES.NOT_SURE,
        ORANGE_2_2_A: RESPONSES.NO,
        ORANGE_2_2_1_A: RESPONSES.NOT_SURE,
      };

      const router = {
        push: sinon.spy(),
      };

      it('ORANGE_2_2_1_A: should correctly route to the next question', () => {
        navigateForward(SHORT_NAME_MAP.ORANGE_2_2_1_A, formResponses, router);
        expect(router.push.firstCall.calledWith(ROUTES.ORANGE_2_2_2)).to.be
          .true;
      });
    });
  });

  describe('navigateBackward', () => {
    describe('routing back home', () => {
      const formResponses = {
        SERVICE_PERIOD: RESPONSES.DURING_BOTH_PERIODS,
        BURN_PIT_2_1: null,
      };

      const router = {
        push: sinon.spy(),
      };

      it('SERVICE_PERIOD: should correctly route back home', () => {
        navigateBackward(SHORT_NAME_MAP.SERVICE_PERIOD, formResponses, router);
        expect(router.push.firstCall.calledWith(ROUTES.HOME)).to.be.true;
      });
    });

    describe('routing to BURN_PIT_2_1_1', () => {
      const formResponses = {
        SERVICE_PERIOD: RESPONSES.DURING_BOTH_PERIODS,
        BURN_PIT_2_1: RESPONSES.NO,
        BURN_PIT_2_1_1: RESPONSES.NOT_SURE,
      };

      const router = {
        push: sinon.spy(),
      };

      it('BURN_PIT_2_1_2: should correctly route to the previous question', () => {
        navigateBackward(SHORT_NAME_MAP.BURN_PIT_2_1_2, formResponses, router);
        expect(router.push.firstCall.calledWith(ROUTES.BURN_PIT_2_1_1)).to.be
          .true;
      });
    });

    describe('routing to BURN_PIT_2_1_2', () => {
      const formResponses = {
        SERVICE_PERIOD: RESPONSES.DURING_BOTH_PERIODS,
        BURN_PIT_2_1: RESPONSES.NO,
        BURN_PIT_2_1_1: RESPONSES.NOT_SURE,
        BURN_PIT_2_1_2: RESPONSES.NO,
      };

      const router = {
        push: sinon.spy(),
      };

      it('ORANGE_2_2_A: should correctly route to the previous question', () => {
        navigateBackward(SHORT_NAME_MAP.ORANGE_2_2_A, formResponses, router);
        expect(router.push.firstCall.calledWith(ROUTES.BURN_PIT_2_1_2)).to.be
          .true;
      });
    });

    describe('routing to ORANGE_2_2_1_A', () => {
      const formResponses = {
        SERVICE_PERIOD: RESPONSES.DURING_BOTH_PERIODS,
        BURN_PIT_2_1: RESPONSES.NO,
        BURN_PIT_2_1_1: RESPONSES.NOT_SURE,
        BURN_PIT_2_1_2: RESPONSES.NO,
        ORANGE_2_2_A: RESPONSES.NOT_SURE,
        ORANGE_2_2_1_A: RESPONSES.YES,
      };

      const router = {
        push: sinon.spy(),
      };

      it('ORANGE_2_2_1_B: should correctly route to the previous question', () => {
        navigateBackward(SHORT_NAME_MAP.ORANGE_2_2_1_B, formResponses, router);
        expect(router.push.firstCall.calledWith(ROUTES.ORANGE_2_2_1_A)).to.be
          .true;
      });
    });
  });
});
