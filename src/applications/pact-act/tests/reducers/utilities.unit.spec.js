import { expect } from 'chai';
import {
  createFormStore,
  getNewStoreAfterRemovingResponse,
  setShortNameValue,
  updateFormValue,
} from '../../reducers/utilities';
import { RESPONSES, SHORT_NAME_MAP } from '../../constants/question-data-map';

const { KOREA_DMZ, NOT_SURE, VIETNAM_REP, VIETNAM_WATERS, YES } = RESPONSES;
const { BURN_PIT_2_1_2, ORANGE_2_2_B, ORANGE_2_2_1_A } = SHORT_NAME_MAP;

describe('utilities: reducer', () => {
  describe('createFormStore', () => {
    it('should properly create the store structure', () => {
      expect(createFormStore(SHORT_NAME_MAP)).to.deep.equal({
        SERVICE_PERIOD: null,
        BURN_PIT_2_1: null,
        BURN_PIT_2_1_1: null,
        BURN_PIT_2_1_2: null,
        ORANGE_2_2_A: null,
        ORANGE_2_2_B: null,
        ORANGE_2_2_1_A: null,
        ORANGE_2_2_1_B: null,
        ORANGE_2_2_2: null,
        ORANGE_2_2_3: null,
        RADIATION_2_3_A: null,
        RADIATION_2_3_B: null,
        LEJEUNE_2_4: null,
      });
    });
  });

  describe('getNewStoreAfterRemovingResponse', () => {
    it('should correctly return the store after removing a checkbox response', () => {
      const currentFormContents = [KOREA_DMZ, VIETNAM_REP, VIETNAM_WATERS];

      expect(
        getNewStoreAfterRemovingResponse(currentFormContents, {
          payload: VIETNAM_REP,
        }),
      ).to.deep.equal([KOREA_DMZ, VIETNAM_WATERS]);
    });

    it('should correctly return the store after removing a checkbox response', () => {
      const currentFormContents = [KOREA_DMZ];

      expect(
        getNewStoreAfterRemovingResponse(currentFormContents, {
          payload: VIETNAM_REP,
        }),
      ).to.deep.equal(null);
    });
  });

  describe('setShortNameValue', () => {
    it('should correctly return the store with the updated value', () => {
      const form = {
        BURN_PIT_2_1: NOT_SURE,
        BURN_PIT_2_1_1: NOT_SURE,
        BURN_PIT_2_1_2: YES,
      };

      const state = {
        form,
        viewedIntroPage: false,
      };

      expect(
        setShortNameValue(BURN_PIT_2_1_2, NOT_SURE, {
          ...state,
          form: {
            ...form,
            BURN_PIT_2_1_2: NOT_SURE,
          },
        }),
      );
    });

    it('should correctly return the store with the updated value', () => {
      const form = {
        BURN_PIT_2_1: NOT_SURE,
        BURN_PIT_2_1_1: NOT_SURE,
        BURN_PIT_2_1_2: YES,
      };

      const state = {
        form,
        viewedIntroPage: false,
      };

      expect(
        setShortNameValue(BURN_PIT_2_1_2, NOT_SURE, {
          ...state,
          form: {
            ...form,
            BURN_PIT_2_1_2: NOT_SURE,
          },
        }),
      );
    });
  });

  describe('updateFormValue', () => {
    it('should correctly return the store when needing to remove a checkbox', () => {
      const form = {
        ORANGE_2_2_A: NOT_SURE,
        ORANGE_2_2_B: [VIETNAM_REP, VIETNAM_WATERS],
      };

      const state = {
        form,
        viewedIntroPage: false,
      };

      expect(
        updateFormValue(ORANGE_2_2_B, true, state, {
          payload: VIETNAM_WATERS,
        }),
      ).to.deep.equal({
        ...state,
        form: {
          ...form,
          ORANGE_2_2_B: [VIETNAM_REP],
        },
      });
    });

    it('should correctly return the store when needing to add a checkbox', () => {
      const form = {
        ORANGE_2_2_A: NOT_SURE,
        ORANGE_2_2_B: [VIETNAM_REP, VIETNAM_WATERS],
      };

      const state = {
        form,
        viewedIntroPage: false,
      };

      expect(
        updateFormValue(ORANGE_2_2_B, true, state, {
          payload: KOREA_DMZ,
        }),
      ).to.deep.equal({
        ...state,
        form: {
          ...form,
          ORANGE_2_2_B: [VIETNAM_REP, VIETNAM_WATERS, KOREA_DMZ],
        },
      });
    });

    it('should correctly return the store when needing to update a radio value', () => {
      const form = {
        ORANGE_2_2_A: NOT_SURE,
        ORANGE_2_2_1_A: NOT_SURE,
      };

      const state = {
        form,
        viewedIntroPage: false,
      };

      expect(
        updateFormValue(ORANGE_2_2_1_A, false, state, {
          payload: YES,
        }),
      ).to.deep.equal({
        ...state,
        form: {
          ...form,
          ORANGE_2_2_1_A: YES,
        },
      });
    });
  });
});
