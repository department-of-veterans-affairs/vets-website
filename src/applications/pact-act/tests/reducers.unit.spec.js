import { expect } from 'chai';
import {
  createFormStore,
  getNewStoreAfterRemovingResponse,
  setShortNameValue,
  updateFormValue,
} from '../reducers/utilities';
import { RESPONSES, SHORT_NAME_MAP } from '../constants/question-data-map';

describe('reducer', () => {
  describe('utilities: createFormStore', () => {
    it('should correctly populate the store with all of the question short names', () => {
      expect(createFormStore(SHORT_NAME_MAP)).to.deep.equal({
        BURN_PIT_2_1: null,
        BURN_PIT_2_1_1: null,
        BURN_PIT_2_1_2: null,
        LEJEUNE_2_4: null,
        ORANGE_2_2_1_A: null,
        ORANGE_2_2_1_B: null,
        ORANGE_2_2_2: null,
        ORANGE_2_2_3: null,
        ORANGE_2_2_A: null,
        ORANGE_2_2_B: null,
        RADIATION_2_3_A: null,
        RADIATION_2_3_B: null,
        SERVICE_PERIOD: null,
      });
    });
  });

  describe('utilities: getNewStoreAfterRemovingResponse', () => {
    const currentFormContents = ['Test 1', 'Test 2', 'Test 3'];
    const action = {
      payload: 'Test 2',
    };

    it('should return the correct value for the given short name for the store', () => {
      expect(
        getNewStoreAfterRemovingResponse(currentFormContents, action),
      ).to.deep.equal(['Test 1', 'Test 3']);
    });
  });

  describe('utilities: setShortNameValue', () => {
    const SHORT_NAME = 'ORANGE_2_2_2';
    const newFormContents = RESPONSES.NOT_SURE;
    const state = {
      form: {
        BURN_PIT_2_1: RESPONSES.YES,
        ORANGE_2_2_A: RESPONSES.NO,
        ORANGE_2_2_1_A: RESPONSES.NOT_SURE,
        ORANGE_2_2_2: RESPONSES.NO,
        SERVICE_PERIOD: RESPONSES.DURING_BOTH_PERIODS,
      },
    };

    it('should return the correct new form store', () => {
      expect(
        setShortNameValue(SHORT_NAME, newFormContents, state),
      ).to.deep.equal({
        form: {
          BURN_PIT_2_1: RESPONSES.YES,
          ORANGE_2_2_A: RESPONSES.NO,
          ORANGE_2_2_1_A: RESPONSES.NOT_SURE,
          ORANGE_2_2_2: RESPONSES.NOT_SURE,
          SERVICE_PERIOD: RESPONSES.DURING_BOTH_PERIODS,
        },
      });
    });
  });

  describe('utilities: updateFormValue', () => {
    it('should return the correct new form store for a checkbox response', () => {
      const SHORT_NAME = 'ORANGE_2_2_1_B';
      const state = {
        form: {
          BURN_PIT_2_1: RESPONSES.YES,
          ORANGE_2_2_A: RESPONSES.NO,
          ORANGE_2_2_1_A: RESPONSES.YES,
          SERVICE_PERIOD: RESPONSES.DURING_BOTH_PERIODS,
        },
      };

      const action = {
        payload: 'Test 1',
      };

      expect(updateFormValue(SHORT_NAME, true, state, action)).to.deep.equal({
        form: {
          BURN_PIT_2_1: RESPONSES.YES,
          ORANGE_2_2_A: RESPONSES.NO,
          ORANGE_2_2_1_A: RESPONSES.YES,
          ORANGE_2_2_1_B: ['Test 1'],
          SERVICE_PERIOD: RESPONSES.DURING_BOTH_PERIODS,
        },
      });
    });

    it('should return the correct new form store for a radio response', () => {
      const SHORT_NAME = 'ORANGE_2_2_2';
      const state = {
        form: {
          BURN_PIT_2_1: RESPONSES.YES,
          ORANGE_2_2_A: RESPONSES.NO,
          ORANGE_2_2_1_A: RESPONSES.NO,
          ORANGE_2_2_2: RESPONSES.YES,
          SERVICE_PERIOD: RESPONSES.DURING_BOTH_PERIODS,
        },
      };

      const action = {
        payload: RESPONSES.NOT_SURE,
      };

      expect(updateFormValue(SHORT_NAME, false, state, action)).to.deep.equal({
        form: {
          BURN_PIT_2_1: RESPONSES.YES,
          ORANGE_2_2_A: RESPONSES.NO,
          ORANGE_2_2_1_A: RESPONSES.NO,
          ORANGE_2_2_2: RESPONSES.NOT_SURE,
          SERVICE_PERIOD: RESPONSES.DURING_BOTH_PERIODS,
        },
      });
    });
  });
});
