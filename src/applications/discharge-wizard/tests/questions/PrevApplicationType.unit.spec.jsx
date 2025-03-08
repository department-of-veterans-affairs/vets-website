import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { ROUTES } from '../../constants';

import PrevApplicationType from '../../components/questions/PrevApplicationType';

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
  setPrevApplicationType: () => {},
  router: {
    push: pushStub,
  },
  viewedIntroPage: true,
};

const propsNoIntroPage = {
  formResponses: {},
  setPrevApplicationType: () => {},
  router: {
    push: pushStub,
  },
  viewedIntroPage: false,
};

describe('Previous Application Type Page', () => {
  afterEach(() => {
    pushStub.resetHistory();
  });

  it('should correctly load the Previous Application page in the standard flow', () => {
    const screen = render(
      <Provider store={mockStoreStandard}>
        <PrevApplicationType {...propsStandard} />
      </Provider>,
    );

    expect(screen.getByTestId('duw-prev_application_type')).to.exist;
  });

  it('should redirect to home when the intro page has not been viewed', () => {
    render(
      <Provider store={mockStoreNoIntroPage}>
        <PrevApplicationType {...propsNoIntroPage} />
      </Provider>,
    );

    expect(pushStub.withArgs(ROUTES.HOME).called).to.be.true;
  });
});
