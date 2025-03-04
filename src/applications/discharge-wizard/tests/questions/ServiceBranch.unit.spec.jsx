import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { ROUTES } from '../../constants';

import ServiceBranch from '../../components/questions/ServiceBranch';

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

const setServiceBranch = sinon.stub();
const pushStub = sinon.stub();

const propsStandard = {
  formResponses: {},
  setServiceBranch,
  router: {
    push: pushStub,
  },
  viewedIntroPage: true,
};

const propsNoIntroPage = {
  formResponses: {},
  setServiceBranch,
  router: {
    push: pushStub,
  },
  viewedIntroPage: false,
};

describe('Service Branch Page', () => {
  afterEach(() => {
    pushStub.resetHistory();
  });

  it('should correctly load the service branch page in the standard flow', () => {
    const screen = render(
      <Provider store={mockStoreStandard}>
        <ServiceBranch {...propsStandard} />
      </Provider>,
    );

    expect(screen.getByTestId('duw-service_branch')).to.exist;
  });

  it('should redirect to home when the intro page has not been viewed', () => {
    render(
      <Provider store={mockStoreNoIntroPage}>
        <ServiceBranch {...propsNoIntroPage} />
      </Provider>,
    );

    expect(pushStub.withArgs(ROUTES.HOME).called).to.be.true;
  });
});
