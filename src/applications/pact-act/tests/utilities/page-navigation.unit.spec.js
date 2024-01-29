import { expect } from 'chai';
import sinon from 'sinon';
import {
  navigateBackward,
  navigateForward,
} from '../../utilities/page-navigation';
import { ROUTES } from '../../constants';
import { RESPONSES, SHORT_NAME_MAP } from '../../constants/question-data-map';

const pushSpy = sinon.spy();

const router = {
  push: pushSpy,
};

beforeEach(() => {
  pushSpy.reset();
});

describe('navigateForward', () => {
  describe('routing to BURN_PIT_2_1', () => {
    const formResponses = {
      SERVICE_PERIOD: RESPONSES.NINETY_OR_LATER,
      BURN_PIT_2_1: null,
    };

    it('SERVICE_PERIOD: should correctly route to the next question', () => {
      navigateForward(SHORT_NAME_MAP.SERVICE_PERIOD, formResponses, router);
      expect(router.push.firstCall.calledWith(ROUTES.BURN_PIT_2_1)).to.be.true;
    });
  });

  describe('routing to BURN_PIT_2_1_2', () => {
    const formResponses = {
      SERVICE_PERIOD: RESPONSES.DURING_BOTH_PERIODS,
      BURN_PIT_2_1: RESPONSES.NO,
      BURN_PIT_2_1_1: RESPONSES.NOT_SURE,
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

    it('BURN_PIT_2_1_2: should correctly route to the next question', () => {
      navigateForward(SHORT_NAME_MAP.BURN_PIT_2_1_2, formResponses, router);
      expect(router.push.firstCall.calledWith(ROUTES.ORANGE_2_2_A)).to.be.true;
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

    it('ORANGE_2_2_1_A: should correctly route to the next question', () => {
      navigateForward(SHORT_NAME_MAP.ORANGE_2_2_1_A, formResponses, router);
      expect(router.push.firstCall.calledWith(ROUTES.ORANGE_2_2_2)).to.be.true;
    });
  });

  describe('routing to LEJEUNE_2_4', () => {
    const formResponses = {
      SERVICE_PERIOD: RESPONSES.DURING_BOTH_PERIODS,
      BURN_PIT_2_1: RESPONSES.NO,
      BURN_PIT_2_1_1: RESPONSES.NOT_SURE,
      BURN_PIT_2_1_2: RESPONSES.NOT_SURE,
      ORANGE_2_2_A: RESPONSES.NO,
      ORANGE_2_2_1_A: RESPONSES.NOT_SURE,
      ORANGE_2_2_2: RESPONSES.YES,
      RADIATION_2_3_A: RESPONSES.NO,
    };

    it('RADIATION_2_4: should correctly route to the next question', () => {
      navigateForward(SHORT_NAME_MAP.RADIATION_2_3_A, formResponses, router);
      expect(router.push.firstCall.calledWith(ROUTES.LEJEUNE_2_4)).to.be.true;
    });
  });

  describe('routing to RESULTS_1_1', () => {
    const formResponses = {
      SERVICE_PERIOD: RESPONSES.NINETY_OR_LATER,
      BURN_PIT_2_1: RESPONSES.YES,
    };

    it('RESULTS_1_1: should correctly route to the results page', () => {
      navigateForward(SHORT_NAME_MAP.BURN_PIT_2_1, formResponses, router);

      expect(router.push.firstCall.calledWith(ROUTES.RESULTS_1_1)).to.be.true;
    });
  });

  describe('routing to RESULTS_2', () => {
    const formResponses = {
      SERVICE_PERIOD: RESPONSES.DURING_BOTH_PERIODS,
      BURN_PIT_2_1: RESPONSES.NO,
      BURN_PIT_2_1_1: RESPONSES.NOT_SURE,
      BURN_PIT_2_1_2: RESPONSES.NOT_SURE,
      ORANGE_2_2_A: RESPONSES.NO,
      ORANGE_2_2_1_A: RESPONSES.NOT_SURE,
      ORANGE_2_2_2: RESPONSES.NO,
      ORANGE_2_2_3: RESPONSES.NO,
      RADIATION_2_3_A: RESPONSES.NO,
      LEJEUNE_2_4: RESPONSES.YES,
    };

    it('RESULTS_2: should correctly route to the results page', () => {
      navigateForward(SHORT_NAME_MAP.LEJEUNE_2_4, formResponses, router);

      expect(router.push.firstCall.calledWith(ROUTES.RESULTS_2)).to.be.true;
    });
  });
});

describe('navigateBackward', () => {
  describe('routing back home', () => {
    const formResponses = {
      SERVICE_PERIOD: RESPONSES.DURING_BOTH_PERIODS,
    };

    it('SERVICE_PERIOD: should correctly route back home', () => {
      navigateBackward(SHORT_NAME_MAP.SERVICE_PERIOD, formResponses, router);

      expect(router.push.firstCall.calledWith(ROUTES.HOME)).to.be.true;
    });
  });

  describe('routing to SERVICE_PERIOD', () => {
    const formResponses = {
      SERVICE_PERIOD: RESPONSES.NINETY_OR_LATER,
      BURN_PIT_2_1: RESPONSES.NO,
    };

    it('SERVICE_PERIOD: should correctly route to the next question', () => {
      navigateBackward(SHORT_NAME_MAP.BURN_PIT_2_1, formResponses, router);
      expect(router.push.firstCall.calledWith(ROUTES.SERVICE_PERIOD)).to.be
        .true;
    });
  });

  describe('routing to BURN_PIT_2_1_1', () => {
    const formResponses = {
      SERVICE_PERIOD: RESPONSES.DURING_BOTH_PERIODS,
      BURN_PIT_2_1: RESPONSES.NO,
      BURN_PIT_2_1_1: RESPONSES.NOT_SURE,
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

    it('ORANGE_2_2_1_B: should correctly route to the previous question', () => {
      navigateBackward(SHORT_NAME_MAP.ORANGE_2_2_1_B, formResponses, router);
      expect(router.push.firstCall.calledWith(ROUTES.ORANGE_2_2_1_A)).to.be
        .true;
    });
  });
});
