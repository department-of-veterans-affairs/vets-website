import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { ROUTES } from '../../constants';

import FailureToExhaust from '../../components/questions/FailureToExhaust';

const mockStoreStandard = {
  getState: () => ({
    dischargeUpgradeWizard: {
      duwForm: {
        form: {},
        viewedIntroPage: true,
      },
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
};

const mockStoreNoIntroPage = {
  getState: () => ({
    dischargeUpgradeWizard: {
      duwForm: {
        form: {},
        viewedIntroPage: false,
      },
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
};

const pushStub = sinon.stub();

const propsStandard = {
  formResponses: {},
  setFailureToExhaust: () => {},
  router: {
    push: pushStub,
  },
  viewedIntroPage: true,
};

const propsNoIntroPage = {
  formResponses: {},
  setFailureToExhaust: () => {},
  router: {
    push: pushStub,
  },
  viewedIntroPage: false,
};

describe('Failure to Exhaust Page', () => {
  afterEach(() => {
    pushStub.resetHistory();
  });

  it('should correctly load the Failure to Exhaust page in the standard flow', () => {
    const screen = render(
      <Provider store={mockStoreStandard}>
        <FailureToExhaust {...propsStandard} />
      </Provider>,
    );

    expect(screen.getByTestId('duw-failure_to_exhaust')).to.exist;
  });

  it('should redirect to home when the intro page has not been viewed', () => {
    render(
      <Provider store={mockStoreNoIntroPage}>
        <FailureToExhaust {...propsNoIntroPage} />
      </Provider>,
    );

    expect(pushStub.withArgs(ROUTES.HOME).called).to.be.true;
  });
});
