import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { ROUTES } from '../../constants';
import { RESPONSES, SHORT_NAME_MAP } from '../../constants/question-data-map';
import { displayConditionsMet } from '../../utilities/display-logic-questions';

import Radiation23A from '../../containers/questions/radiation/Radiation-2-3-A';

const { RADIATION_2_3_A } = SHORT_NAME_MAP;
const {
  DURING_BOTH_PERIODS,
  EIGHTYNINE_OR_EARLIER,
  GUAM,
  LAOS,
  NINETY_OR_LATER,
  NO,
  NOT_SURE,
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

const setRadiationStub = sinon.stub();
const pushStub = sinon.stub();

const props = {
  formResponses: {},
  setRadiation23A: setRadiationStub,
  router: {
    push: pushStub,
  },
  viewedIntroPage: true,
};

const propsNoIntroPage = {
  formResponses: {},
  setRadiation23A: setRadiationStub,
  router: {
    push: pushStub,
  },
  viewedIntroPage: false,
};

describe('Radiation 2.3.A Page', () => {
  afterEach(() => {
    setRadiationStub.resetHistory();
    pushStub.resetHistory();
  });

  it('should correctly load the radiation page', () => {
    const screen = render(
      <Provider store={mockStore}>
        <Radiation23A {...props} />
      </Provider>,
    );

    expect(screen.getByTestId('paw-radiation2_3_A')).to.exist;
  });

  describe('redirects', () => {
    it('should redirect to home when the intro page has not been viewed', () => {
      render(
        <Provider store={mockStoreNoIntroPage}>
          <Radiation23A {...propsNoIntroPage} />
        </Provider>,
      );

      expect(pushStub.withArgs(ROUTES.HOME).called).to.be.true;
    });
  });
});

describe('displayConditionsAreMet', () => {
  it('RADIATION_2_3_A: should return true when the display conditions are met', () => {
    const formResponses = {
      ORANGE_2_2_A: NO,
      ORANGE_2_2_B: null,
      ORANGE_2_2_1_A: NO,
      ORANGE_2_2_1_B: null,
      ORANGE_2_2_2: NOT_SURE,
      ORANGE_2_2_3: YES,
      SERVICE_PERIOD: EIGHTYNINE_OR_EARLIER,
    };

    expect(displayConditionsMet(RADIATION_2_3_A, formResponses)).to.equal(true);
  });

  it('RADIATION_2_3_A: should return true when the display conditions are met', () => {
    const formResponses = {
      ORANGE_2_2_A: NO,
      ORANGE_2_2_B: null,
      ORANGE_2_2_1_A: NO,
      ORANGE_2_2_1_B: null,
      ORANGE_2_2_2: YES,
      ORANGE_2_2_3: null,
      SERVICE_PERIOD: EIGHTYNINE_OR_EARLIER,
    };

    expect(displayConditionsMet(RADIATION_2_3_A, formResponses)).to.equal(true);
  });

  it('RADIATION_2_3_A: should return true when the display conditions are met', () => {
    const formResponses = {
      ORANGE_2_2_A: YES,
      ORANGE_2_2_B: [VIETNAM_REP, VIETNAM_WATERS],
      ORANGE_2_2_1_A: null,
      ORANGE_2_2_1_B: null,
      ORANGE_2_2_2: null,
      ORANGE_2_2_3: null,
      SERVICE_PERIOD: EIGHTYNINE_OR_EARLIER,
    };

    expect(displayConditionsMet(RADIATION_2_3_A, formResponses)).to.equal(true);
  });

  it('RADIATION_2_3_A: should return true when the display conditions are met', () => {
    const formResponses = {
      ORANGE_2_2_A: NO,
      ORANGE_2_2_B: null,
      ORANGE_2_2_1_A: YES,
      ORANGE_2_2_1_B: [GUAM],
      ORANGE_2_2_2: null,
      ORANGE_2_2_3: null,
      SERVICE_PERIOD: EIGHTYNINE_OR_EARLIER,
    };

    expect(displayConditionsMet(RADIATION_2_3_A, formResponses)).to.equal(true);
  });

  it('RADIATION_2_3_A: should return true when the display conditions are met', () => {
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
      SERVICE_PERIOD: DURING_BOTH_PERIODS,
    };

    expect(displayConditionsMet(RADIATION_2_3_A, formResponses)).to.equal(true);
  });

  it('RADIATION_2_3_A: should return true when the display conditions are met', () => {
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
      SERVICE_PERIOD: DURING_BOTH_PERIODS,
    };

    expect(displayConditionsMet(RADIATION_2_3_A, formResponses)).to.equal(true);
  });

  it('RADIATION_2_3_A: should return true when the display conditions are met', () => {
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
      SERVICE_PERIOD: DURING_BOTH_PERIODS,
    };

    expect(displayConditionsMet(RADIATION_2_3_A, formResponses)).to.equal(true);
  });

  it('RADIATION_2_3_A: should return true when the display conditions are met', () => {
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
      SERVICE_PERIOD: DURING_BOTH_PERIODS,
    };

    expect(displayConditionsMet(RADIATION_2_3_A, formResponses)).to.equal(true);
  });

  it('RADIATION_2_3_A: should return false when the display conditions are not met', () => {
    const formResponses = {
      SERVICE_PERIOD: NINETY_OR_LATER,
    };

    expect(displayConditionsMet(RADIATION_2_3_A, formResponses)).to.equal(
      false,
    );
  });

  it('RADIATION_2_3_A: should return false when the display conditions are not met', () => {
    const formResponses = {
      ORANGE_2_2_B: NO,
      ORANGE_2_2_1_B: NO,
      ORANGE_2_2_2: NO,
      SERVICE_PERIOD: EIGHTYNINE_OR_EARLIER,
    };

    expect(displayConditionsMet(RADIATION_2_3_A, formResponses)).to.equal(
      false,
    );
  });

  it('RADIATION_2_3_A: should return false when the display conditions are not met', () => {
    const formResponses = {
      ORANGE_2_2_B: NO,
      ORANGE_2_2_1_B: NO,
      ORANGE_2_2_2: NO,
      ORANGE_2_2_3: null,
      SERVICE_PERIOD: DURING_BOTH_PERIODS,
    };

    expect(displayConditionsMet(RADIATION_2_3_A, formResponses)).to.equal(
      false,
    );
  });
});
