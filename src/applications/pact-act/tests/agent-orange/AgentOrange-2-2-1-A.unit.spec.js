import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { ROUTES } from '../../constants';
import { RESPONSES, SHORT_NAME_MAP } from '../../constants/question-data-map';
import { displayConditionsMet } from '../../utilities/display-logic-questions';

import Orange221A from '../../containers/questions/agent-orange/AgentOrange-2-2-1-A';

const { ORANGE_2_2_1_A } = SHORT_NAME_MAP;
const {
  DURING_BOTH_PERIODS,
  EIGHTYNINE_OR_EARLIER,
  NINETY_OR_LATER,
  NO,
  NOT_SURE,
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

const setAgentOrangeStub = sinon.stub();
const pushStub = sinon.stub();

const props = {
  formResponses: {},
  setOrange221A: setAgentOrangeStub,
  router: {
    push: pushStub,
  },
  viewedIntroPage: true,
};

const propsNoIntroPage = {
  formResponses: {},
  setOrange221A: setAgentOrangeStub,
  router: {
    push: pushStub,
  },
  viewedIntroPage: false,
};

describe('Agent Orange 2.2.1.A Page', () => {
  afterEach(() => {
    setAgentOrangeStub.resetHistory();
    pushStub.resetHistory();
  });

  it('should correctly load the agent orange page', () => {
    const screen = render(
      <Provider store={mockStore}>
        <Orange221A {...props} />
      </Provider>,
    );

    expect(screen.getByTestId('paw-orange2_2_1_A')).to.exist;
  });

  describe('redirects', () => {
    it('should redirect to home when the intro page has not been viewed', () => {
      render(
        <Provider store={mockStoreNoIntroPage}>
          <Orange221A {...propsNoIntroPage} />
        </Provider>,
      );

      expect(pushStub.withArgs(ROUTES.HOME).called).to.be.true;
    });
  });
});

describe('displayConditionsAreMet', () => {
  it('ORANGE_2_2_1_A: should return true when the display conditions are met', () => {
    const formResponses = {
      SERVICE_PERIOD: EIGHTYNINE_OR_EARLIER,
      ORANGE_2_2_A: NO,
      ORANGE_2_2_B: null,
    };

    expect(displayConditionsMet(ORANGE_2_2_1_A, formResponses)).to.equal(true);
  });

  it('ORANGE_2_2_1_A: should return true when the display conditions are met', () => {
    const formResponses = {
      SERVICE_PERIOD: EIGHTYNINE_OR_EARLIER,
      ORANGE_2_2_A: NOT_SURE,
      ORANGE_2_2_B: null,
    };

    expect(displayConditionsMet(ORANGE_2_2_1_A, formResponses)).to.equal(true);
  });

  it('ORANGE_2_2_1_A: should return true when the display conditions are met', () => {
    const formResponses = {
      BURN_PIT_2_1: NOT_SURE,
      BURN_PIT_2_1_1: NOT_SURE,
      BURN_PIT_2_1_2: NOT_SURE,
      ORANGE_2_2_A: NO,
      ORANGE_2_2_B: null,
      SERVICE_PERIOD: DURING_BOTH_PERIODS,
    };

    expect(displayConditionsMet(ORANGE_2_2_1_A, formResponses)).to.equal(true);
  });

  it('ORANGE_2_2_1_A: should return true when the display conditions are met', () => {
    const formResponses = {
      BURN_PIT_2_1: NO,
      BURN_PIT_2_1_1: NO,
      BURN_PIT_2_1_2: YES,
      ORANGE_2_2_A: NO,
      ORANGE_2_2_B: null,
      SERVICE_PERIOD: DURING_BOTH_PERIODS,
    };

    expect(displayConditionsMet(ORANGE_2_2_1_A, formResponses)).to.equal(true);
  });

  it('ORANGE_2_2_1_A: should return true when the display conditions are met', () => {
    const formResponses = {
      BURN_PIT_2_1: NO,
      BURN_PIT_2_1_1: NO,
      BURN_PIT_2_1_2: NO,
      ORANGE_2_2_A: NO,
      ORANGE_2_2_B: null,
      SERVICE_PERIOD: DURING_BOTH_PERIODS,
    };

    expect(displayConditionsMet(ORANGE_2_2_1_A, formResponses)).to.equal(true);
  });

  it('ORANGE_2_2_1_A: should return true when the display conditions are met', () => {
    const formResponses = {
      BURN_PIT_2_1: YES,
      BURN_PIT_2_1_1: null,
      BURN_PIT_2_1_2: null,
      ORANGE_2_2_A: NO,
      ORANGE_2_2_B: null,
      SERVICE_PERIOD: DURING_BOTH_PERIODS,
    };

    expect(displayConditionsMet(ORANGE_2_2_1_A, formResponses)).to.equal(true);
  });

  it('ORANGE_2_2_1_A: should return true when the display conditions are met', () => {
    const formResponses = {
      BURN_PIT_2_1: NO,
      BURN_PIT_2_1_1: YES,
      BURN_PIT_2_1_2: null,
      ORANGE_2_2_A: NO,
      ORANGE_2_2_B: null,
      SERVICE_PERIOD: DURING_BOTH_PERIODS,
    };

    expect(displayConditionsMet(ORANGE_2_2_1_A, formResponses)).to.equal(true);
  });

  it('ORANGE_2_2_1_A: should return false when the display conditions are not met', () => {
    const formResponses = {
      SERVICE_PERIOD: NINETY_OR_LATER,
    };

    expect(displayConditionsMet(ORANGE_2_2_1_A, formResponses)).to.equal(false);
  });

  it('ORANGE_2_2_1_A: should return false when the display conditions are not met', () => {
    const formResponses = {
      BURN_PIT_2_1: NO,
      BURN_PIT_2_1_1: NO,
      BURN_PIT_2_1_2: NO,
      ORANGE_2_2_A: YES,
      ORANGE_2_2_1_A: null,
      SERVICE_PERIOD: DURING_BOTH_PERIODS,
    };

    expect(displayConditionsMet(ORANGE_2_2_1_A, formResponses)).to.equal(false);
  });

  it('ORANGE_2_2_1_A: should return false when the display conditions are not met', () => {
    const formResponses = {
      BURN_PIT_2_1: NOT_SURE,
      BURN_PIT_2_1_1: NOT_SURE,
      BURN_PIT_2_1_2: NOT_SURE,
      ORANGE_2_2_A: null,
      SERVICE_PERIOD: DURING_BOTH_PERIODS,
    };

    expect(displayConditionsMet(ORANGE_2_2_1_A, formResponses)).to.equal(false);
  });
});
