import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { ROUTES } from '../../constants';
import { RESPONSES, SHORT_NAME_MAP } from '../../constants/question-data-map';
import { displayConditionsMet } from '../../utilities/display-logic';

import Orange222 from '../../containers/questions/agent-orange/AgentOrange-2-2-2';

// Form data is intentionally skipped for the render tests since these are very basic "does it load?" tests

// This file contains tests for the component's display as well as testing displayConditionsMet
// for this question specifically

const mockStoreStandard = {
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

const propsStandard = {
  formResponses: {},
  setOrange222: setAgentOrangeStub,
  router: {
    push: pushStub,
  },
  viewedIntroPage: true,
};

const propsNoIntroPage = {
  formResponses: {},
  setOrange222: setAgentOrangeStub,
  router: {
    push: pushStub,
  },
  viewedIntroPage: false,
};

describe('Agent Orange 2.2.2 Page', () => {
  afterEach(() => {
    setAgentOrangeStub.resetHistory();
    pushStub.resetHistory();
  });

  it('should correctly load the agent orange page in the standard flow', () => {
    const screen = render(
      <Provider store={mockStoreStandard}>
        <Orange222 {...propsStandard} />
      </Provider>,
    );

    expect(screen.getByTestId('paw-orange2_2_2')).to.exist;
  });

  describe('redirects', () => {
    it('should redirect to home when the intro page has not been viewed', () => {
      render(
        <Provider store={mockStoreNoIntroPage}>
          <Orange222 {...propsNoIntroPage} />
        </Provider>,
      );

      expect(pushStub.withArgs(ROUTES.HOME).called).to.be.true;
    });
  });
});

describe('displayConditionsAreMet', () => {
  it('ORANGE_2_2_2: should return true when the display conditions are met', () => {
    const formResponses = {
      ORANGE_2_2_A: RESPONSES.NO,
      ORANGE_2_2_1_A: RESPONSES.NO,
      SERVICE_PERIOD: RESPONSES.EIGHTYNINE_OR_EARLIER,
    };

    expect(
      displayConditionsMet(SHORT_NAME_MAP.ORANGE_2_2_2, formResponses),
    ).to.equal(true);
  });

  it('ORANGE_2_2_2: should return true when the display conditions are met', () => {
    const formResponses = {
      BURN_PIT_2_1: RESPONSES.NO,
      BURN_PIT_2_1_1: RESPONSES.NOT_SURE,
      BURN_PIT_2_1_2: RESPONSES.YES,
      ORANGE_2_2_A: RESPONSES.NO,
      ORANGE_2_2_1_A: RESPONSES.NO,
      SERVICE_PERIOD: RESPONSES.DURING_BOTH_PERIODS,
    };

    expect(
      displayConditionsMet(SHORT_NAME_MAP.ORANGE_2_2_2, formResponses),
    ).to.equal(true);
  });

  it('ORANGE_2_2_2: should return true when the display conditions are met', () => {
    const formResponses = {
      BURN_PIT_2_1: RESPONSES.NOT_SURE,
      BURN_PIT_2_1_1: RESPONSES.YES,
      ORANGE_2_2_A: RESPONSES.NO,
      ORANGE_2_2_1_A: RESPONSES.NO,
      SERVICE_PERIOD: RESPONSES.DURING_BOTH_PERIODS,
    };

    expect(
      displayConditionsMet(SHORT_NAME_MAP.ORANGE_2_2_2, formResponses),
    ).to.equal(true);
  });

  it('ORANGE_2_2_2: should return true when the display conditions are met', () => {
    const formResponses = {
      BURN_PIT_2_1: RESPONSES.YES,
      ORANGE_2_2_A: RESPONSES.NO,
      ORANGE_2_2_1_A: RESPONSES.NO,
      SERVICE_PERIOD: RESPONSES.DURING_BOTH_PERIODS,
    };

    expect(
      displayConditionsMet(SHORT_NAME_MAP.ORANGE_2_2_2, formResponses),
    ).to.equal(true);
  });

  it('ORANGE_2_2_2: should return false when the display conditions are not met', () => {
    const formResponses = {
      SERVICE_PERIOD: RESPONSES.NINETY_OR_LATER,
    };

    expect(
      displayConditionsMet(SHORT_NAME_MAP.ORANGE_2_2_2, formResponses),
    ).to.equal(false);
  });

  it('ORANGE_2_2_2: should return false when the display conditions are not met', () => {
    const formResponses = {
      BURN_PIT_2_1: RESPONSES.NO,
      BURN_PIT_2_1_1: RESPONSES.NOT_SURE,
      BURN_PIT_2_1_2: RESPONSES.YES,
      ORANGE_2_2_A: RESPONSES.NO,
      ORANGE_2_2_1_A: RESPONSES.YES,
      SERVICE_PERIOD: RESPONSES.DURING_BOTH_PERIODS,
    };

    expect(
      displayConditionsMet(SHORT_NAME_MAP.ORANGE_2_2_2, formResponses),
    ).to.equal(false);
  });
});
