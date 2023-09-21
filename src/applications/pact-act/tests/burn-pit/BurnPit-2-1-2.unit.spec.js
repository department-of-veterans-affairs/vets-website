import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { RESPONSES } from '../../utilities/question-data-map';
import { ROUTES } from '../../constants';

import BurnPit212 from '../../containers/questions/burn-pit/BurnPit-2-1-2';

const mockStoreStandard = {
  getState: () => ({
    pactAct: {
      form: {
        BURN_PIT_2_1: null,
        BURN_PIT_2_1_1: null,
        BURN_PIT_2_1_2: null,
        SERVICE_PERIOD: RESPONSES.NINETY_OR_LATER,
      },
      viewedIntroPage: true,
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
};

const mockStoreNoIntroPage = {
  getState: () => ({
    pactAct: {
      form: {
        BURN_PIT_2_1: null,
        BURN_PIT_2_1_1: null,
        BURN_PIT_2_1_2: null,
        SERVICE_PERIOD: RESPONSES.NINETY_OR_LATER,
      },
      viewedIntroPage: false,
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
};

const setBurnPitStub = sinon.stub();
const pushStub = sinon.stub();

const propsStandard = {
  formResponses: {
    BURN_PIT_2_1: null,
    BURN_PIT_2_1_1: null,
    BURN_PIT_2_1_2: null,
    SERVICE_PERIOD: RESPONSES.NINETY_OR_LATER,
  },
  setBurnPit212: setBurnPitStub,
  router: {
    push: pushStub,
  },
  viewedIntroPage: true,
};

const propsNoIntroPage = {
  formResponses: {
    BURN_PIT_2_1: null,
    BURN_PIT_2_1_1: null,
    BURN_PIT_2_1_2: null,
    SERVICE_PERIOD: RESPONSES.NINETY_OR_LATER,
  },
  setBurnPit212: setBurnPitStub,
  router: {
    push: pushStub,
  },
  viewedIntroPage: false,
};

describe('Burn Pit 2.1 Page', () => {
  afterEach(() => {
    setBurnPitStub.resetHistory();
    pushStub.resetHistory();
  });

  it('should correctly load the burn pit page in the standard flow', () => {
    const screen = render(
      <Provider store={mockStoreStandard}>
        <BurnPit212 {...propsStandard} />
      </Provider>,
    );

    expect(screen.getByTestId('paw-burnPit2_1_2')).to.exist;
  });

  describe('redirects', () => {
    it('should redirect to home when the intro page has not been viewed', () => {
      render(
        <Provider store={mockStoreNoIntroPage}>
          <BurnPit212 {...propsNoIntroPage} />
        </Provider>,
      );

      expect(pushStub.withArgs(ROUTES.HOME).called).to.be.true;
    });
  });
});
