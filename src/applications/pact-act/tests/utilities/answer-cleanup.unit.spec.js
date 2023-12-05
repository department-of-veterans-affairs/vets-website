import { expect } from 'chai';
import sinon from 'sinon';
import {
  cleanUpAnswers,
  gatherDCsNotMetQuestions,
  gatherQuestionsToReset,
  gatherWrongFlowQuestions,
} from '../../utilities/answer-cleanup';
import { RESPONSES, SHORT_NAME_MAP } from '../../constants/question-data-map';

const {
  BURN_PIT_2_1,
  BURN_PIT_2_1_1,
  BURN_PIT_2_1_2,
  ORANGE_2_2_A,
  ORANGE_2_2_1_A,
  ORANGE_2_2_2,
  ORANGE_2_2_3,
  RADIATION_2_3_A,
  RADIATION_2_3_B,
  LEJEUNE_2_4,
  SERVICE_PERIOD,
} = SHORT_NAME_MAP;

const {
  DURING_BOTH_PERIODS,
  EIGHTYNINE_OR_EARLIER,
  ENEWETAK_ATOLL,
  GREENLAND_THULE,
  KOREA_DMZ,
  NINETY_OR_LATER,
  NO,
  NOT_SURE,
  VIETNAM_WATERS,
  YES,
} = RESPONSES;

describe('answer cleanup utilities', () => {
  describe('gatherWrongFlowQuestions', () => {
    it('should correctly gather the questions with responses that no longer belong in the current service period flow', () => {
      const nonNullShortNames = [
        BURN_PIT_2_1,
        BURN_PIT_2_1_1,
        BURN_PIT_2_1_2,
        ORANGE_2_2_A,
        ORANGE_2_2_1_A,
        ORANGE_2_2_2,
        ORANGE_2_2_3,
        RADIATION_2_3_A,
        RADIATION_2_3_B,
        LEJEUNE_2_4,
      ];

      const questionsAfterCurrent = [
        BURN_PIT_2_1,
        BURN_PIT_2_1_1,
        BURN_PIT_2_1_2,
      ];

      expect(
        gatherWrongFlowQuestions(nonNullShortNames, questionsAfterCurrent),
      ).to.deep.equal([
        ORANGE_2_2_A,
        ORANGE_2_2_1_A,
        ORANGE_2_2_2,
        ORANGE_2_2_3,
        RADIATION_2_3_A,
        RADIATION_2_3_B,
        LEJEUNE_2_4,
      ]);
    });

    it('should correctly gather the questions with responses that no longer belong in the current service period flow', () => {
      const nonNullShortNames = [
        BURN_PIT_2_1,
        BURN_PIT_2_1_1,
        BURN_PIT_2_1_2,
        ORANGE_2_2_A,
        ORANGE_2_2_1_A,
        ORANGE_2_2_2,
        ORANGE_2_2_3,
      ];

      const questionsAfterCurrent = [
        ORANGE_2_2_A,
        ORANGE_2_2_1_A,
        ORANGE_2_2_2,
        ORANGE_2_2_3,
        RADIATION_2_3_A,
        RADIATION_2_3_B,
        LEJEUNE_2_4,
      ];

      expect(
        gatherWrongFlowQuestions(nonNullShortNames, questionsAfterCurrent),
      ).to.deep.equal([BURN_PIT_2_1, BURN_PIT_2_1_1, BURN_PIT_2_1_2]);
    });
  });

  describe('gatherDCsNotMetQuestions', () => {
    it('should correctly gather the questions with responses where the display conditions are not met', () => {
      const nonNullShortNames = [
        BURN_PIT_2_1,
        BURN_PIT_2_1_1,
        BURN_PIT_2_1_2,
        ORANGE_2_2_A,
        ORANGE_2_2_1_A,
        ORANGE_2_2_2,
        ORANGE_2_2_3,
      ];

      const currentQuestionName = ORANGE_2_2_1_A;
      const questionsToBeNulled = [];
      const responsesToClean = {
        SERVICE_PERIOD: DURING_BOTH_PERIODS,
        BURN_PIT_2_1: NO,
        BURN_PIT_2_1_1: NO,
        BURN_PIT_2_1_2: NO,
        ORANGE_2_2_A: NO,
        ORANGE_2_2_1_A: YES,
        ORANGE_2_2_1_B: null,
        ORANGE_2_2_2: NO,
        ORANGE_2_2_3: NO,
      };

      expect(
        gatherDCsNotMetQuestions(
          nonNullShortNames,
          currentQuestionName,
          questionsToBeNulled,
          responsesToClean,
        ),
      ).to.deep.equal([ORANGE_2_2_2, ORANGE_2_2_3]);
    });

    it('should correctly gather the questions with responses where the display conditions are not met', () => {
      const nonNullShortNames = [
        ORANGE_2_2_A,
        ORANGE_2_2_1_A,
        ORANGE_2_2_2,
        ORANGE_2_2_3,
        RADIATION_2_3_A,
        RADIATION_2_3_B,
        LEJEUNE_2_4,
      ];

      const currentQuestionName = ORANGE_2_2_2;
      const questionsToBeNulled = [];
      const responsesToClean = {
        SERVICE_PERIOD: EIGHTYNINE_OR_EARLIER,
        ORANGE_2_2_A: NO,
        ORANGE_2_2_1_A: NO,
        ORANGE_2_2_2: YES,
        ORANGE_2_2_3: NOT_SURE,
        RADIATION_2_3_A: YES,
        RADIATION_2_3_B: [ENEWETAK_ATOLL],
        LEJEUNE_2_4: YES,
      };

      expect(
        gatherDCsNotMetQuestions(
          nonNullShortNames,
          currentQuestionName,
          questionsToBeNulled,
          responsesToClean,
        ),
      ).to.deep.equal([ORANGE_2_2_3]);
    });
  });

  describe('gatherQuestionsToReset', () => {
    it('should correctly gather the questions where the response should be nulled', () => {
      const nonNullShortNames = [
        BURN_PIT_2_1,
        BURN_PIT_2_1_1,
        BURN_PIT_2_1_2,
        ORANGE_2_2_A,
        ORANGE_2_2_1_A,
        ORANGE_2_2_2,
        ORANGE_2_2_3,
        RADIATION_2_3_A,
        RADIATION_2_3_B,
      ];

      const questionsAfterCurrent = [
        BURN_PIT_2_1,
        BURN_PIT_2_1_1,
        BURN_PIT_2_1_2,
      ];

      const currentQuestionName = SERVICE_PERIOD;

      const responsesToClean = {
        SERVICE_PERIOD: NINETY_OR_LATER,
        BURN_PIT_2_1: NO,
        BURN_PIT_2_1_1: YES,
        BURN_PIT_2_1_2: NO,
        ORANGE_2_2_A: NO,
        ORANGE_2_2_1_A: NO,
        ORANGE_2_2_2: NO,
        ORANGE_2_2_3: NO,
        RADIATION_2_3_A: YES,
        RADIATION_2_3_B: [GREENLAND_THULE],
      };

      expect(
        gatherQuestionsToReset(
          nonNullShortNames,
          questionsAfterCurrent,
          currentQuestionName,
          responsesToClean,
        ),
      ).to.deep.equal([
        ORANGE_2_2_A,
        ORANGE_2_2_1_A,
        ORANGE_2_2_2,
        ORANGE_2_2_3,
        RADIATION_2_3_A,
        RADIATION_2_3_B,
        BURN_PIT_2_1_2,
      ]);
    });
  });

  describe('cleanUpAnswers', () => {
    it('should call the updateCleanedFormStore action with the correct arguments', () => {
      const responsesInStore = {
        SERVICE_PERIOD: EIGHTYNINE_OR_EARLIER,
        BURN_PIT_2_1: NO,
        BURN_PIT_2_1_1: NOT_SURE,
        BURN_PIT_2_1_2: NO,
        ORANGE_2_2_A: YES,
        ORANGE_2_2_B: [KOREA_DMZ, VIETNAM_WATERS],
      };

      const updateCleanedFormStoreSpy = sinon.spy();
      const currentQuestionName = SERVICE_PERIOD;

      cleanUpAnswers(
        responsesInStore,
        updateCleanedFormStoreSpy,
        currentQuestionName,
      );

      expect(
        updateCleanedFormStoreSpy.calledWith({
          SERVICE_PERIOD: EIGHTYNINE_OR_EARLIER,
          BURN_PIT_2_1: null,
          BURN_PIT_2_1_1: null,
          BURN_PIT_2_1_2: null,
          ORANGE_2_2_A: YES,
          ORANGE_2_2_B: [KOREA_DMZ, VIETNAM_WATERS],
        }),
      ).to.be.true;
    });

    it('should call the updateCleanedFormStore action with the correct arguments', () => {
      const responsesInStore = {
        SERVICE_PERIOD: EIGHTYNINE_OR_EARLIER,
        BURN_PIT_2_1: NO,
        BURN_PIT_2_1_1: NOT_SURE,
        BURN_PIT_2_1_2: NO,
        ORANGE_2_2_A: NO,
        ORANGE_2_2_B: null,
        ORANGE_2_2_1_A: NO,
        ORANGE_2_2_2: YES,
        ORANGE_2_2_3: null,
        RADIATION_2_3_A: NO,
        RADIATION_2_3_B: null,
        LEJEUNE_2_4: YES,
      };

      const updateCleanedFormStoreSpy = sinon.spy();
      const currentQuestionName = SERVICE_PERIOD;

      cleanUpAnswers(
        responsesInStore,
        updateCleanedFormStoreSpy,
        currentQuestionName,
      );

      expect(
        updateCleanedFormStoreSpy.calledWith({
          SERVICE_PERIOD: EIGHTYNINE_OR_EARLIER,
          BURN_PIT_2_1: null,
          BURN_PIT_2_1_1: null,
          BURN_PIT_2_1_2: null,
          ORANGE_2_2_A: NO,
          ORANGE_2_2_B: null,
          ORANGE_2_2_1_A: NO,
          ORANGE_2_2_2: YES,
          ORANGE_2_2_3: null,
          RADIATION_2_3_A: NO,
          RADIATION_2_3_B: null,
          LEJEUNE_2_4: YES,
        }),
      ).to.be.true;
    });

    it('should call the updateCleanedFormStore action with the correct arguments', () => {
      const responsesInStore = {
        SERVICE_PERIOD: NINETY_OR_LATER,
        BURN_PIT_2_1: YES,
        BURN_PIT_2_1_1: NOT_SURE,
        BURN_PIT_2_1_2: NO,
      };

      const updateCleanedFormStoreSpy = sinon.spy();
      const currentQuestionName = BURN_PIT_2_1;

      cleanUpAnswers(
        responsesInStore,
        updateCleanedFormStoreSpy,
        currentQuestionName,
      );

      expect(
        updateCleanedFormStoreSpy.calledWith({
          SERVICE_PERIOD: NINETY_OR_LATER,
          BURN_PIT_2_1: YES,
          BURN_PIT_2_1_1: null,
          BURN_PIT_2_1_2: null,
        }),
      ).to.be.true;
    });

    it('should call the updateCleanedFormStore action with the correct arguments', () => {
      const responsesInStore = {
        SERVICE_PERIOD: DURING_BOTH_PERIODS,
        BURN_PIT_2_1: NOT_SURE,
        BURN_PIT_2_1_1: NOT_SURE,
        BURN_PIT_2_1_2: YES,
        ORANGE_2_2_A: YES,
        ORANGE_2_2_B: [VIETNAM_WATERS],
        ORANGE_2_2_1_A: NO,
        ORANGE_2_2_1_B: null,
        ORANGE_2_2_2: YES,
        ORANGE_2_2_3: null,
        RADIATION_2_3_A: NO,
        RADIATION_2_3_B: [ENEWETAK_ATOLL],
        LEJEUNE_2_4: YES,
      };

      const updateCleanedFormStoreSpy = sinon.spy();
      const currentQuestionName = RADIATION_2_3_A;

      cleanUpAnswers(
        responsesInStore,
        updateCleanedFormStoreSpy,
        currentQuestionName,
      );

      expect(
        updateCleanedFormStoreSpy.calledWith({
          SERVICE_PERIOD: DURING_BOTH_PERIODS,
          BURN_PIT_2_1: NOT_SURE,
          BURN_PIT_2_1_1: NOT_SURE,
          BURN_PIT_2_1_2: YES,
          ORANGE_2_2_A: YES,
          ORANGE_2_2_B: [VIETNAM_WATERS],
          ORANGE_2_2_1_A: NO,
          ORANGE_2_2_1_B: null,
          ORANGE_2_2_2: YES,
          ORANGE_2_2_3: null,
          RADIATION_2_3_A: NO,
          RADIATION_2_3_B: null,
          LEJEUNE_2_4: YES,
        }),
      ).to.be.true;
    });
  });
});
