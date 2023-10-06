import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { ROUTES } from '../../constants';
import { RESPONSES, SHORT_NAME_MAP } from '../../constants/question-data-map';
import { displayConditionsMet } from '../../utilities/display-logic';

import Orange223 from '../../containers/questions/agent-orange/AgentOrange-2-2-3';

const { ORANGE_2_2_3 } = SHORT_NAME_MAP;
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
  setOrange223: setAgentOrangeStub,
  router: {
    push: pushStub,
  },
  viewedIntroPage: true,
};

const propsNoIntroPage = {
  formResponses: {},
  setOrange223: setAgentOrangeStub,
  router: {
    push: pushStub,
  },
  viewedIntroPage: false,
};

describe('Agent Orange 2.2.3 Page', () => {
  afterEach(() => {
    setAgentOrangeStub.resetHistory();
    pushStub.resetHistory();
  });

  it('should correctly load the agent orange page in the standard flow', () => {
    const screen = render(
      <Provider store={mockStoreStandard}>
        <Orange223 {...propsStandard} />
      </Provider>,
    );

    expect(screen.getByTestId('paw-orange2_2_3')).to.exist;
  });

  describe('redirects', () => {
    it('should redirect to home when the intro page has not been viewed', () => {
      render(
        <Provider store={mockStoreNoIntroPage}>
          <Orange223 {...propsNoIntroPage} />
        </Provider>,
      );

      expect(pushStub.withArgs(ROUTES.HOME).called).to.be.true;
    });
  });
});

describe('displayConditionsAreMet', () => {
  it('ORANGE_2_2_3: should return true when the display conditions are met', () => {
    const formResponses = {
      ORANGE_2_2_2: NO,
      SERVICE_PERIOD: EIGHTYNINE_OR_EARLIER,
    };

    expect(displayConditionsMet(ORANGE_2_2_3, formResponses)).to.equal(true);
  });

  it('ORANGE_2_2_3: should return true when the display conditions are met', () => {
    const formResponses = {
      ORANGE_2_2_2: NOT_SURE,
      SERVICE_PERIOD: EIGHTYNINE_OR_EARLIER,
    };

    expect(displayConditionsMet(ORANGE_2_2_3, formResponses)).to.equal(true);
  });

  it('ORANGE_2_2_3: should return true when the display conditions are met', () => {
    const formResponses = {
      ORANGE_2_2_2: NO,
      SERVICE_PERIOD: DURING_BOTH_PERIODS,
    };

    expect(displayConditionsMet(ORANGE_2_2_3, formResponses)).to.equal(true);
  });

  it('ORANGE_2_2_3: should return true when the display conditions are met', () => {
    const formResponses = {
      ORANGE_2_2_2: NOT_SURE,
      SERVICE_PERIOD: DURING_BOTH_PERIODS,
    };

    expect(displayConditionsMet(ORANGE_2_2_3, formResponses)).to.equal(true);
  });

  it('ORANGE_2_2_3: should return false when the display conditions are not met', () => {
    const formResponses = {
      SERVICE_PERIOD: NINETY_OR_LATER,
    };

    expect(displayConditionsMet(ORANGE_2_2_3, formResponses)).to.equal(false);
  });

  it('ORANGE_2_2_3: should return false when the display conditions are not met', () => {
    const formResponses = {
      ORANGE_2_2_2: YES,
      SERVICE_PERIOD: EIGHTYNINE_OR_EARLIER,
    };

    expect(displayConditionsMet(ORANGE_2_2_3, formResponses)).to.equal(false);
  });

  it('ORANGE_2_2_3: should return false when the display conditions are not met', () => {
    const formResponses = {
      ORANGE_2_2_2: YES,
      SERVICE_PERIOD: DURING_BOTH_PERIODS,
    };

    expect(displayConditionsMet(ORANGE_2_2_3, formResponses)).to.equal(false);
  });
});
