import { expect } from 'chai';
import sinon from 'sinon';
import {
  displayConditionsMet,
  navigateBackward,
  navigateForward,
} from '../utilities/display-logic';
import { ROUTES } from '../constants';
import { RESPONSES, SHORT_NAME_MAP } from '../utilities/question-data-map';

describe('utils: display logic', () => {
  describe('displayConditionsMet', () => {
    // The rest of display conditions are tested in separate files in this directory
    describe('displaying SERVICE_PERIOD', () => {
      it('SERVICE PERIOD: should return true when the display conditions are met', () => {
        const formResponses = {
          BURN_PIT_2_1: null,
          SERVICE_PERIOD: null,
        };

        expect(displayConditionsMet('SERVICE_PERIOD', formResponses)).to.equal(
          true,
        );
      });
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
        BURN_PIT_2_1_2: RESPONSES.NO,
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
  });
});
