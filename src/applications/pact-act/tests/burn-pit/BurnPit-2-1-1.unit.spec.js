import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { ROUTES } from '../../constants';
import { RESPONSES, SHORT_NAME_MAP } from '../../constants/question-data-map';
import { displayConditionsMet } from '../../utilities/display-logic';

import BurnPit211 from '../../containers/questions/burn-pit/BurnPit-2-1-1';

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

const setBurnPitStub = sinon.stub();
const pushStub = sinon.stub();

const propsStandard = {
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

  it('should correctly load the burn pit page in the standard flow', () => {
    const screen = render(
      <Provider store={mockStoreStandard}>
        <BurnPit211 {...propsStandard} />
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
      BURN_PIT_2_1: RESPONSES.NO,
      SERVICE_PERIOD: RESPONSES.NINETY_OR_LATER,
    };

    expect(
      displayConditionsMet(SHORT_NAME_MAP.BURN_PIT_2_1_1, formResponses),
    ).to.equal(true);
  });

  it('BURN_PIT_2_1_1: should return true when the display conditions are met', () => {
    const formResponses = {
      BURN_PIT_2_1: RESPONSES.NOT_SURE,
      SERVICE_PERIOD: RESPONSES.DURING_BOTH_PERIODS,
    };

    expect(
      displayConditionsMet(SHORT_NAME_MAP.BURN_PIT_2_1_1, formResponses),
    ).to.equal(true);
  });

  it('BURN_PIT_2_1_1: should return false when the display conditions are not met', () => {
    const formResponses = {
      SERVICE_PERIOD: RESPONSES.EIGHTYNINE_OR_EARLIER,
    };

    expect(
      displayConditionsMet(SHORT_NAME_MAP.BURN_PIT_2_1_1, formResponses),
    ).to.equal(false);
  });

  it('BURN_PIT_2_1_1: should return false when the display conditions are not met', () => {
    const formResponses = {
      BURN_PIT_2_1: RESPONSES.YES,
      SERVICE_PERIOD: RESPONSES.NINETY_OR_LATER,
    };

    expect(
      displayConditionsMet(SHORT_NAME_MAP.BURN_PIT_2_1_1, formResponses),
    ).to.equal(false);
  });
});
