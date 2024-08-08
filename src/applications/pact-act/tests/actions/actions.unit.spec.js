import { expect } from 'chai';

import {
  PAW_VIEWED_INTRO_PAGE,
  PAW_UPDATE_SERVICE_PERIOD,
  PAW_UPDATE_BURN_PIT_2_1,
  PAW_UPDATE_BURN_PIT_2_1_1,
  PAW_UPDATE_BURN_PIT_2_1_2,
  PAW_UPDATE_ORANGE_2_2_A,
  PAW_UPDATE_ORANGE_2_2_B,
  PAW_UPDATE_ORANGE_2_2_1_A,
  PAW_UPDATE_ORANGE_2_2_1_B,
  PAW_UPDATE_ORANGE_2_2_2,
  PAW_UPDATE_ORANGE_2_2_3,
  PAW_UPDATE_RADIATION_2_3_A,
  PAW_UPDATE_RADIATION_2_3_B,
  PAW_UPDATE_LEJEUNE_2_4,
  PAW_UPDATE_FORM_STORE,
} from '../../constants';

import { RESPONSES } from '../../constants/question-data-map';

import {
  updateIntroPageViewed,
  updateServicePeriod,
  updateBurnPit21,
  updateBurnPit211,
  updateBurnPit212,
  updateOrange22A,
  updateOrange22B,
  updateOrange221A,
  updateOrange221B,
  updateOrange222,
  updateOrange223,
  updateRadiation23A,
  updateRadiation23B,
  updateLejeune24,
  updateFormStore,
} from '../../actions';

const {
  CAMBODIA,
  GREENLAND_THULE,
  NINETY_OR_LATER,
  NO,
  NOT_SURE,
  VIETNAM_REP,
  YES,
} = RESPONSES;

describe('pact act actions', () => {
  describe('updateIntroPageViewed', () => {
    it('should return the correct action type and value', () => {
      expect(updateIntroPageViewed(true)).to.deep.equal({
        type: PAW_VIEWED_INTRO_PAGE,
        payload: true,
      });
    });
  });

  describe('updateServicePeriod', () => {
    it('should return the correct action type and value', () => {
      expect(updateServicePeriod(NINETY_OR_LATER)).to.deep.equal({
        type: PAW_UPDATE_SERVICE_PERIOD,
        payload: NINETY_OR_LATER,
      });
    });
  });

  describe('updateBurnPit21', () => {
    it('should return the correct action type and value', () => {
      expect(updateBurnPit21(NO)).to.deep.equal({
        type: PAW_UPDATE_BURN_PIT_2_1,
        payload: NO,
      });
    });
  });

  describe('updateBurnPit211', () => {
    it('should return the correct action type and value', () => {
      expect(updateBurnPit211(YES)).to.deep.equal({
        type: PAW_UPDATE_BURN_PIT_2_1_1,
        payload: YES,
      });
    });
  });

  describe('updateBurnPit212', () => {
    it('should return the correct action type and value', () => {
      expect(updateBurnPit212(NOT_SURE)).to.deep.equal({
        type: PAW_UPDATE_BURN_PIT_2_1_2,
        payload: NOT_SURE,
      });
    });
  });

  describe('updateOrange22A', () => {
    it('should return the correct action type and value', () => {
      expect(updateOrange22A(YES)).to.deep.equal({
        type: PAW_UPDATE_ORANGE_2_2_A,
        payload: YES,
      });
    });
  });

  describe('updateOrange22B', () => {
    it('should return the correct action type and value', () => {
      expect(updateOrange22B(VIETNAM_REP)).to.deep.equal({
        type: PAW_UPDATE_ORANGE_2_2_B,
        payload: VIETNAM_REP,
      });
    });
  });

  describe('updateOrange221A', () => {
    it('should return the correct action type and value', () => {
      expect(updateOrange221A(YES)).to.deep.equal({
        type: PAW_UPDATE_ORANGE_2_2_1_A,
        payload: YES,
      });
    });
  });

  describe('updateOrange221B', () => {
    it('should return the correct action type and value', () => {
      expect(updateOrange221B(CAMBODIA)).to.deep.equal({
        type: PAW_UPDATE_ORANGE_2_2_1_B,
        payload: CAMBODIA,
      });
    });
  });

  describe('updateOrange222', () => {
    it('should return the correct action type and value', () => {
      expect(updateOrange222(NO)).to.deep.equal({
        type: PAW_UPDATE_ORANGE_2_2_2,
        payload: NO,
      });
    });
  });

  describe('updateOrange223', () => {
    it('should return the correct action type and value', () => {
      expect(updateOrange223(NOT_SURE)).to.deep.equal({
        type: PAW_UPDATE_ORANGE_2_2_3,
        payload: NOT_SURE,
      });
    });
  });

  describe('updateRadiation23A', () => {
    it('should return the correct action type and value', () => {
      expect(updateRadiation23A(YES)).to.deep.equal({
        type: PAW_UPDATE_RADIATION_2_3_A,
        payload: YES,
      });
    });
  });

  describe('updateRadiation23B', () => {
    it('should return the correct action type and value', () => {
      expect(updateRadiation23B(GREENLAND_THULE)).to.deep.equal({
        type: PAW_UPDATE_RADIATION_2_3_B,
        payload: GREENLAND_THULE,
      });
    });
  });

  describe('updateLejeune24', () => {
    it('should return the correct action type and value', () => {
      expect(updateLejeune24(YES)).to.deep.equal({
        type: PAW_UPDATE_LEJEUNE_2_4,
        payload: YES,
      });
    });
  });

  describe('updateFormStore', () => {
    const formUpdate = {
      SERVICE_PERIOD: NINETY_OR_LATER,
    };

    it('should return the correct action type and value', () => {
      expect(updateFormStore(formUpdate)).to.deep.equal({
        type: PAW_UPDATE_FORM_STORE,
        payload: formUpdate,
      });
    });
  });
});
