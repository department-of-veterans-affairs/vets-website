import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { RESPONSES } from '../../constants/question-data-map';
import { ROUTES } from '../../constants';

import ServiceBranch from '../../components/v2/questions/ServiceBranch';

const mockStoreStandard = {
  getState: () => ({
    dischargeUpgradeWizard: {
      duwform: {
        form: {
          SERVICE_BRANCH: null,
          DISCHARGE_YEAR: null,
          DISCHARGE_MONTH: null,
        },
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
      duwform: {
        form: {
          SERVICE_BRANCH: null,
          DISCHARGE_YEAR: null,
          DISCHARGE_MONTH: null,
        },
        viewedIntroPage: false,
      },
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
};

const pushStub = sinon.stub();

const propsStandard = {
  formResponses: {
    SERVICE_BRANCH: null,
    DISCHARGE_YEAR: null,
    DISCHARGE_MONTH: null,
  },
  setServicePeriod: () => {},
  router: {
    push: pushStub,
  },
  viewedIntroPage: true,
};

const propsNoIntroPage = {
  formResponses: {
    SERVICE_BRANCH: RESPONSES.ARMY,
    DISCHARGE_YEAR: null,
    DISCHARGE_MONTH: null,
  },
  setServicePeriod: () => {},
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
