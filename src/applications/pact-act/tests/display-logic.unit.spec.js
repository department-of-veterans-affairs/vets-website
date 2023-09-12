import { expect } from 'chai';
import sinon from 'sinon';
import {
  areDisplayConditionsMet,
  navigateForward,
} from '../utilities/display-logic';
import { ROUTES } from '../constants';
import { RESPONSES, SHORT_NAME_MAP } from '../utilities/question-data-map';

describe('utils: display logic', () => {
  describe('areDisplayConditionsMet', () => {
    describe('displaying SERVICE_PERIOD', () => {
      it('SERVICE PERIOD: should return true when the display conditions are met', () => {
        const formResponses = {
          BURN_PIT_2_1: null,
          SERVICE_PERIOD: null,
        };

        expect(
          areDisplayConditionsMet('SERVICE_PERIOD', formResponses),
        ).to.equal(true);
      });
    });

    describe('displaying BURN_PIT_2_1', () => {
      it('BURN_PIT_2_1: should return true when the display conditions are met', () => {
        const formResponses = {
          BURN_PIT_2_1: null,
          SERVICE_PERIOD: RESPONSES.NINETY_OR_LATER,
        };

        expect(areDisplayConditionsMet('BURN_PIT_2_1', formResponses)).to.equal(
          true,
        );
      });

      it('BURN_PIT_2_1: should return true when the display conditions are met', () => {
        const formResponses = {
          BURN_PIT_2_1: null,
          SERVICE_PERIOD: RESPONSES.DURING_BOTH_PERIODS,
        };

        expect(areDisplayConditionsMet('BURN_PIT_2_1', formResponses)).to.equal(
          true,
        );
      });

      it('BURN_PIT_2_1: should return false when the display conditions are not met', () => {
        const formResponses = {
          BURN_PIT_2_1: null,
          SERVICE_PERIOD: RESPONSES.EIGHTYNINE_OR_EARLIER,
        };

        expect(areDisplayConditionsMet('BURN_PIT_2_1', formResponses)).to.equal(
          false,
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
  });
});
