import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { ROUTES } from '../../constants';
import { RESPONSES, SHORT_NAME_MAP } from '../../constants/question-data-map';
import { displayConditionsMet } from '../../utilities/display-logic-questions';

import BurnPit211 from '../../containers/questions/burn-pit/BurnPit-2-1-1';

const { BURN_PIT_2_1_1 } = SHORT_NAME_MAP;
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

const setBurnPitStub = sinon.stub();
const pushStub = sinon.stub();

const props = {
  formResponses: {},
  setBurnPit211: setBurnPitStub,
  router: {
    push: pushStub,
  },
  viewedIntroPage: true,
};

const propsNoIntroPage = {
  formResponses: {},
  setBurnPit211: setBurnPitStub,
  router: {
    push: pushStub,
  },
  viewedIntroPage: false,
};

describe('Burn Pit 2.1.1 Page', () => {
  afterEach(() => {
    setBurnPitStub.resetHistory();
    pushStub.resetHistory();
  });

  it('should correctly load the burn pit page', () => {
    const screen = render(
      <Provider store={mockStore}>
        <BurnPit211 {...props} />
      </Provider>,
    );

    expect(screen.getByTestId('paw-burnPit2_1_1')).to.exist;
  });

  describe('redirects', () => {
    it('should redirect to home when the intro page has not been viewed', () => {
      render(
        <Provider store={mockStoreNoIntroPage}>
          <BurnPit211 {...propsNoIntroPage} />
        </Provider>,
      );

      expect(pushStub.withArgs(ROUTES.HOME).called).to.be.true;
    });
  });
});

describe('displayConditionsAreMet', () => {
  it('BURN_PIT_2_1_1: should return true when the display conditions are met', () => {
    const formResponses = {
      BURN_PIT_2_1: NO,
      SERVICE_PERIOD: NINETY_OR_LATER,
    };

    expect(displayConditionsMet(BURN_PIT_2_1_1, formResponses)).to.equal(true);
  });

  it('BURN_PIT_2_1_1: should return true when the display conditions are met', () => {
    const formResponses = {
      BURN_PIT_2_1: NOT_SURE,
      SERVICE_PERIOD: NINETY_OR_LATER,
    };

    expect(displayConditionsMet(BURN_PIT_2_1_1, formResponses)).to.equal(true);
  });

  it('BURN_PIT_2_1_1: should return true when the display conditions are met', () => {
    const formResponses = {
      BURN_PIT_2_1: NOT_SURE,
      SERVICE_PERIOD: DURING_BOTH_PERIODS,
    };

    expect(displayConditionsMet(BURN_PIT_2_1_1, formResponses)).to.equal(true);
  });

  it('BURN_PIT_2_1_1: should return true when the display conditions are met', () => {
    const formResponses = {
      BURN_PIT_2_1: NO,
      SERVICE_PERIOD: DURING_BOTH_PERIODS,
    };

    expect(displayConditionsMet(BURN_PIT_2_1_1, formResponses)).to.equal(true);
  });

  it('BURN_PIT_2_1_1: should return false when the display conditions are not met', () => {
    const formResponses = {
      SERVICE_PERIOD: EIGHTYNINE_OR_EARLIER,
    };

    expect(displayConditionsMet(BURN_PIT_2_1_1, formResponses)).to.equal(false);
  });

  it('BURN_PIT_2_1_1: should return false when the display conditions are not met', () => {
    const formResponses = {
      BURN_PIT_2_1: YES,
      SERVICE_PERIOD: NINETY_OR_LATER,
    };

    expect(displayConditionsMet(BURN_PIT_2_1_1, formResponses)).to.equal(false);
  });

  it('BURN_PIT_2_1_1: should return false when the display conditions are not met', () => {
    const formResponses = {
      BURN_PIT_2_1: YES,
      SERVICE_PERIOD: DURING_BOTH_PERIODS,
    };

    expect(displayConditionsMet(BURN_PIT_2_1_1, formResponses)).to.equal(false);
  });
});
