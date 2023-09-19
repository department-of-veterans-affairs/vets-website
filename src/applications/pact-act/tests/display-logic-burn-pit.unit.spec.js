import { expect } from 'chai';
import { displayConditionsMet } from '../utilities/display-logic';
import { RESPONSES, SHORT_NAME_MAP } from '../utilities/question-data-map';

describe('utils: display logic', () => {
  describe('displayConditionsMet', () => {
    describe('displaying BURN_PIT_2_1', () => {
      it('BURN_PIT_2_1: should return true when the display conditions are met', () => {
        const formResponses = {
          BURN_PIT_2_1: null,
          SERVICE_PERIOD: RESPONSES.NINETY_OR_LATER,
        };

        expect(
          displayConditionsMet(SHORT_NAME_MAP.BURN_PIT_2_1, formResponses),
        ).to.equal(true);
      });

      it('BURN_PIT_2_1: should return false when the display conditions are not met', () => {
        const formResponses = {
          BURN_PIT_2_1: null,
          SERVICE_PERIOD: RESPONSES.EIGHTYNINE_OR_EARLIER,
        };

        expect(
          displayConditionsMet(SHORT_NAME_MAP.BURN_PIT_2_1, formResponses),
        ).to.equal(false);
      });
    });

    describe('displaying BURN_PIT_2_1_1', () => {
      it('BURN_PIT_2_1_1: should return true when the display conditions are met', () => {
        const formResponses = {
          BURN_PIT_2_1: RESPONSES.NO,
          BURN_PIT_2_1_1: null,
          SERVICE_PERIOD: RESPONSES.NINETY_OR_LATER,
        };

        expect(
          displayConditionsMet(SHORT_NAME_MAP.BURN_PIT_2_1_1, formResponses),
        ).to.equal(true);
      });

      it('BURN_PIT_2_1_1: should return true when the display conditions are met', () => {
        const formResponses = {
          BURN_PIT_2_1: RESPONSES.NOT_SURE,
          BURN_PIT_2_1_1: null,
          SERVICE_PERIOD: RESPONSES.DURING_BOTH_PERIODS,
        };

        expect(
          displayConditionsMet(SHORT_NAME_MAP.BURN_PIT_2_1_1, formResponses),
        ).to.equal(true);
      });

      it('BURN_PIT_2_1_1: should return false when the display conditions are not met', () => {
        const formResponses = {
          BURN_PIT_2_1_1: null,
          SERVICE_PERIOD: RESPONSES.EIGHTYNINE_OR_EARLIER,
        };

        expect(
          displayConditionsMet(SHORT_NAME_MAP.BURN_PIT_2_1_1, formResponses),
        ).to.equal(false);
      });

      it('BURN_PIT_2_1_1: should return false when the display conditions are not met', () => {
        const formResponses = {
          BURN_PIT_2_1: RESPONSES.YES,
          BURN_PIT_2_1_1: null,
          SERVICE_PERIOD: RESPONSES.NINETY_OR_LATER,
        };

        expect(
          displayConditionsMet(SHORT_NAME_MAP.BURN_PIT_2_1_1, formResponses),
        ).to.equal(false);
      });
    });

    describe('displaying BURN_PIT_2_1_2', () => {
      it('BURN_PIT_2_1_2: should return true when the display conditions are met', () => {
        const formResponses = {
          BURN_PIT_2_1: RESPONSES.NO,
          BURN_PIT_2_1_1: RESPONSES.NO,
          BURN_PIT_2_1_2: null,
          SERVICE_PERIOD: RESPONSES.NINETY_OR_LATER,
        };

        expect(
          displayConditionsMet(SHORT_NAME_MAP.BURN_PIT_2_1_2, formResponses),
        ).to.equal(true);
      });

      it('BURN_PIT_2_1_2: should return true when the display conditions are met', () => {
        const formResponses = {
          BURN_PIT_2_1: RESPONSES.NOT_SURE,
          BURN_PIT_2_1_1: RESPONSES.NO,
          BURN_PIT_2_1_2: null,
          SERVICE_PERIOD: RESPONSES.DURING_BOTH_PERIODS,
        };

        expect(
          displayConditionsMet(SHORT_NAME_MAP.BURN_PIT_2_1_2, formResponses),
        ).to.equal(true);
      });

      it('BURN_PIT_2_1_2: should return false when the display conditions are not met', () => {
        const formResponses = {
          BURN_PIT_2_1: null,
          BURN_PIT_2_1_1: null,
          BURN_PIT_2_1_2: null,
          SERVICE_PERIOD: RESPONSES.EIGHTYNINE_OR_EARLIER,
        };

        expect(
          displayConditionsMet(SHORT_NAME_MAP.BURN_PIT_2_1_2, formResponses),
        ).to.equal(false);
      });

      it('BURN_PIT_2_1_2: should return false when the display conditions are not met', () => {
        const formResponses = {
          BURN_PIT_2_1: RESPONSES.YES,
          BURN_PIT_2_1_1: null,
          BURN_PIT_2_1_2: null,
          SERVICE_PERIOD: RESPONSES.NINETY_OR_LATER,
        };

        expect(
          displayConditionsMet(SHORT_NAME_MAP.BURN_PIT_2_1_2, formResponses),
        ).to.equal(false);
      });
    });
  });
});
