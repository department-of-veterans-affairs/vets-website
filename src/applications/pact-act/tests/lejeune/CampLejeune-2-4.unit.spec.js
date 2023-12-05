import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { ROUTES } from '../../constants';
import { RESPONSES, SHORT_NAME_MAP } from '../../constants/question-data-map';
import { displayConditionsMet } from '../../utilities/display-logic-questions';

import Lejeune24 from '../../containers/questions/camp-lejeune/Lejeune-2-4';

const { LEJEUNE_2_4 } = SHORT_NAME_MAP;
const {
  DURING_BOTH_PERIODS,
  EIGHTYNINE_OR_EARLIER,
  ENEWETAK_ATOLL,
  GREENLAND_THULE,
  GUAM,
  LAOS,
  NINETY_OR_LATER,
  NO,
  NOT_SURE,
  SPAIN_PALOMARES,
  VIETNAM_REP,
  VIETNAM_WATERS,
  YES,
} = RESPONSES;

// Form data is intentionally skipped for the render tests since these are very basic "does it load?" tests

// This file contains tests for the component's display as well as testing displayConditionsMet
// for this question specifically

const mockStore = {
  getState: () => ({
    pactAct: {
      form: {},
      viewedIntroPage: true,
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
};

const mockStoreNoIntroPage = {
  getState: () => ({
    pactAct: {
      form: {},
      viewedIntroPage: false,
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
};

const setLejeuneStub = sinon.stub();
const pushStub = sinon.stub();

const props = {
  formResponses: {},
  setLejeune24: setLejeuneStub,
  router: {
    push: pushStub,
  },
  viewedIntroPage: true,
};

const propsNoIntroPage = {
  formResponses: {},
  setLejeune24: setLejeuneStub,
  router: {
    push: pushStub,
  },
  viewedIntroPage: false,
};

describe('Camp Lejeune 2.4 Page', () => {
  afterEach(() => {
    setLejeuneStub.resetHistory();
    pushStub.resetHistory();
  });

  it('should correctly load the lejeune page', () => {
    const screen = render(
      <Provider store={mockStore}>
        <Lejeune24 {...props} />
      </Provider>,
    );

    expect(screen.getByTestId('paw-lejeune2_4')).to.exist;
  });

  describe('redirects', () => {
    it('should redirect to home when the intro page has not been viewed', () => {
      render(
        <Provider store={mockStoreNoIntroPage}>
          <Lejeune24 {...propsNoIntroPage} />
        </Provider>,
      );

      expect(pushStub.withArgs(ROUTES.HOME).called).to.be.true;
    });
  });
});

describe('displayConditionsAreMet', () => {
  it('LEJEUNE_2_4: should return true when the display conditions are met', () => {
    const formResponses = {
      ORANGE_2_2_A: NO,
      ORANGE_2_2_B: null,
      ORANGE_2_2_1_A: NO,
      ORANGE_2_2_1_B: null,
      ORANGE_2_2_2: NOT_SURE,
      ORANGE_2_2_3: YES,
      RADIATION_2_3_A: YES,
      RADIATION_2_3_B: [ENEWETAK_ATOLL],
      SERVICE_PERIOD: EIGHTYNINE_OR_EARLIER,
    };

    expect(displayConditionsMet(LEJEUNE_2_4, formResponses)).to.equal(true);
  });

  it('LEJEUNE_2_4: should return true when the display conditions are met', () => {
    const formResponses = {
      ORANGE_2_2_A: NO,
      ORANGE_2_2_B: null,
      ORANGE_2_2_1_A: NO,
      ORANGE_2_2_1_B: null,
      ORANGE_2_2_2: YES,
      ORANGE_2_2_3: null,
      RADIATION_2_3_A: NOT_SURE,
      RADIATION_2_3_B: null,
      SERVICE_PERIOD: EIGHTYNINE_OR_EARLIER,
    };

    expect(displayConditionsMet(LEJEUNE_2_4, formResponses)).to.equal(true);
  });

  it('LEJEUNE_2_4: should return true when the display conditions are met', () => {
    const formResponses = {
      ORANGE_2_2_A: YES,
      ORANGE_2_2_B: [VIETNAM_REP, VIETNAM_WATERS],
      ORANGE_2_2_1_A: null,
      ORANGE_2_2_1_B: null,
      ORANGE_2_2_2: null,
      ORANGE_2_2_3: null,
      RADIATION_2_3_A: NO,
      RADIATION_2_3_B: null,
      SERVICE_PERIOD: EIGHTYNINE_OR_EARLIER,
    };

    expect(displayConditionsMet(LEJEUNE_2_4, formResponses)).to.equal(true);
  });

  it('LEJEUNE_2_4: should return true when the display conditions are met', () => {
    const formResponses = {
      ORANGE_2_2_A: NO,
      ORANGE_2_2_B: null,
      ORANGE_2_2_1_A: YES,
      ORANGE_2_2_1_B: [GUAM],
      ORANGE_2_2_2: null,
      ORANGE_2_2_3: null,
      RADIATION_2_3_A: YES,
      RADIATION_2_3_B: [ENEWETAK_ATOLL, SPAIN_PALOMARES],
      SERVICE_PERIOD: EIGHTYNINE_OR_EARLIER,
    };

    expect(displayConditionsMet(LEJEUNE_2_4, formResponses)).to.equal(true);
  });

  it('LEJEUNE_2_4: should return true when the display conditions are met', () => {
    const formResponses = {
      BURN_PIT_2_1: YES,
      BURN_PIT_2_1_1: null,
      BURN_PIT_2_1_2: null,
      ORANGE_2_2_A: NO,
      ORANGE_2_2_B: null,
      ORANGE_2_2_1_A: NO,
      ORANGE_2_2_1_B: null,
      ORANGE_2_2_2: NOT_SURE,
      ORANGE_2_2_3: YES,
      RADIATION_2_3_A: YES,
      RADIATION_2_3_B: [ENEWETAK_ATOLL],
      SERVICE_PERIOD: DURING_BOTH_PERIODS,
    };

    expect(displayConditionsMet(LEJEUNE_2_4, formResponses)).to.equal(true);
  });

  it('LEJEUNE_2_4: should return true when the display conditions are met', () => {
    const formResponses = {
      BURN_PIT_2_1: null,
      BURN_PIT_2_1_1: YES,
      BURN_PIT_2_1_2: null,
      ORANGE_2_2_A: NO,
      ORANGE_2_2_B: null,
      ORANGE_2_2_1_A: NO,
      ORANGE_2_2_1_B: null,
      ORANGE_2_2_2: YES,
      ORANGE_2_2_3: null,
      RADIATION_2_3_A: NOT_SURE,
      RADIATION_2_3_B: null,
      SERVICE_PERIOD: DURING_BOTH_PERIODS,
    };

    expect(displayConditionsMet(LEJEUNE_2_4, formResponses)).to.equal(true);
  });

  it('LEJEUNE_2_4: should return true when the display conditions are met', () => {
    const formResponses = {
      BURN_PIT_2_1: null,
      BURN_PIT_2_1_1: null,
      BURN_PIT_2_1_2: YES,
      ORANGE_2_2_A: YES,
      ORANGE_2_2_B: [VIETNAM_REP],
      ORANGE_2_2_1_A: null,
      ORANGE_2_2_1_B: null,
      ORANGE_2_2_2: null,
      ORANGE_2_2_3: null,
      RADIATION_2_3_A: NO,
      RADIATION_2_3_B: null,
      SERVICE_PERIOD: DURING_BOTH_PERIODS,
    };

    expect(displayConditionsMet(LEJEUNE_2_4, formResponses)).to.equal(true);
  });

  it('LEJEUNE_2_4: should return true when the display conditions are met', () => {
    const formResponses = {
      BURN_PIT_2_1: YES,
      BURN_PIT_2_1_1: null,
      BURN_PIT_2_1_2: null,
      ORANGE_2_2_A: NO,
      ORANGE_2_2_B: null,
      ORANGE_2_2_1_A: YES,
      ORANGE_2_2_1_B: [GUAM, LAOS],
      ORANGE_2_2_2: null,
      ORANGE_2_2_3: null,
      RADIATION_2_3_A: YES,
      RADIATION_2_3_B: [GREENLAND_THULE, SPAIN_PALOMARES],
      SERVICE_PERIOD: DURING_BOTH_PERIODS,
    };

    expect(displayConditionsMet(LEJEUNE_2_4, formResponses)).to.equal(true);
  });

  it('LEJEUNE_2_4: should return false when the display conditions are not met', () => {
    const formResponses = {
      SERVICE_PERIOD: NINETY_OR_LATER,
    };

    expect(displayConditionsMet(LEJEUNE_2_4, formResponses)).to.equal(false);
  });

  it('LEJEUNE_2_4: should return false when the display conditions are not met', () => {
    const formResponses = {
      ORANGE_2_2_A: NO,
      ORANGE_2_2_B: null,
      ORANGE_2_2_1_A: NO,
      ORANGE_2_2_1_B: null,
      ORANGE_2_2_2: NOT_SURE,
      ORANGE_2_2_3: NO,
      RADIATION_2_3_A: null,
      RADIATION_2_3_B: null,
      SERVICE_PERIOD: EIGHTYNINE_OR_EARLIER,
    };

    expect(displayConditionsMet(LEJEUNE_2_4, formResponses)).to.equal(false);
  });
});
