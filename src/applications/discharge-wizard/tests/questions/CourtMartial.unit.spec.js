import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { ROUTES } from '../../constants';

import CourtMartial from '../../components/questions/CourtMartial';

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
  setCourtMartial: () => {},
  router: {
    push: pushStub,
  },
  viewedIntroPage: true,
};

const propsNoIntroPage = {
  formResponses: {},
  setCourtMartial: () => {},
  router: {
    push: pushStub,
  },
  viewedIntroPage: false,
};

describe('Court Martial Page', () => {
  afterEach(() => {
    pushStub.resetHistory();
  });

  it('should correctly load the court martial page in the standard flow', () => {
    const screen = render(
      <Provider store={mockStoreStandard}>
        <CourtMartial {...propsStandard} />
      </Provider>,
    );

    expect(screen.getByTestId('duw-court_martial')).to.exist;
  });

  it('should redirect to home when the intro page has not been viewed', () => {
    render(
      <Provider store={mockStoreNoIntroPage}>
        <CourtMartial {...propsNoIntroPage} />
      </Provider>,
    );

    expect(pushStub.withArgs(ROUTES.HOME).called).to.be.true;
  });
});
