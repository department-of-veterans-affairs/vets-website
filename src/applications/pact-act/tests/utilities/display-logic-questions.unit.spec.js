import { expect } from 'chai';
import {
  checkResponses,
  evaluateNestedAndForkedDCs,
  evaluateOneOfChoices,
  makeRoadmap,
  responseMatchesRequired,
  validateMultiCheckboxResponses,
} from '../../utilities/display-logic-questions';
import { RESPONSES, SHORT_NAME_MAP } from '../../constants/question-data-map';

// displayConditionsMet is tested for every question within their respective file (e.g. BurnPit-2-1-1.unit.spec.js)

const {
  SERVICE_PERIOD,
  BURN_PIT_2_1,
  BURN_PIT_2_1_1,
  BURN_PIT_2_1_2,
  ORANGE_2_2_A,
  ORANGE_2_2_B,
  ORANGE_2_2_1_A,
  ORANGE_2_2_1_B,
  ORANGE_2_2_2,
  ORANGE_2_2_3,
  RADIATION_2_3_A,
  RADIATION_2_3_B,
  LEJEUNE_2_4,
} = SHORT_NAME_MAP;

const {
  DURING_BOTH_PERIODS,
  EIGHTYNINE_OR_EARLIER,
  NINETY_OR_LATER,
} = RESPONSES;

describe('utils: display logic for questions', () => {
  describe('makeRoadmap', () => {
    it('should gather the correct list of SHORT_NAMEs for 1989 or earlier', () => {
      expect(makeRoadmap(EIGHTYNINE_OR_EARLIER)).to.deep.equal([
        SERVICE_PERIOD,
        ORANGE_2_2_A,
        ORANGE_2_2_B,
        ORANGE_2_2_1_A,
        ORANGE_2_2_1_B,
        ORANGE_2_2_2,
        ORANGE_2_2_3,
        RADIATION_2_3_A,
        RADIATION_2_3_B,
        LEJEUNE_2_4,
      ]);
    });

    it('should gather the correct list of SHORT_NAMEs for 1990 or later', () => {
      expect(makeRoadmap(NINETY_OR_LATER)).to.deep.equal([
        SERVICE_PERIOD,
        BURN_PIT_2_1,
        BURN_PIT_2_1_1,
        BURN_PIT_2_1_2,
      ]);
    });

    it('should gather the correct list of SHORT_NAMEs for during both of these time periods', () => {
      expect(makeRoadmap(DURING_BOTH_PERIODS)).to.deep.equal([
        SERVICE_PERIOD,
        BURN_PIT_2_1,
        BURN_PIT_2_1_1,
        BURN_PIT_2_1_2,
        ORANGE_2_2_A,
        ORANGE_2_2_B,
        ORANGE_2_2_1_A,
        ORANGE_2_2_1_B,
        ORANGE_2_2_2,
        ORANGE_2_2_3,
        RADIATION_2_3_A,
        RADIATION_2_3_B,
        LEJEUNE_2_4,
      ]);
    });
  });

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

  describe('validateMultiCheckboxResponses', () => {
    it('should return true when the responses match the required response', () => {
      const formResponses = {
        ORANGE_2_2_1_B: [RESPONSES.GUAM],
        SERVICE_PERIOD: RESPONSES.DURING_BOTH_PERIODS,
      };

      const shortName = SHORT_NAME_MAP.ORANGE_2_2_1_B;
      const requiredResponses = [RESPONSES.GUAM, RESPONSES.JOHNSTON_ATOLL];

      expect(
        validateMultiCheckboxResponses(
          requiredResponses,
          formResponses,
          shortName,
        ),
      ).to.be.true;
    });

    it('should return false when the responses do not match the required response', () => {
      const formResponses = {
        SERVICE_PERIOD: RESPONSES.DURING_BOTH_PERIODS,
        ORANGE_2_2_1_B: null,
      };

      const shortName = SHORT_NAME_MAP.ORANGE_2_2_1_B;
      const requiredResponses = [RESPONSES.GUAM, RESPONSES.JOHNSTON_ATOLL];

      expect(
        validateMultiCheckboxResponses(
          requiredResponses,
          formResponses,
          shortName,
        ),
      ).to.be.false;
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
});
