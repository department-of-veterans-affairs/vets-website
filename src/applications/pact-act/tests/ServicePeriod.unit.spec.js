import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { RESPONSES } from '../utilities/question-data-map';
import { ROUTES } from '../constants';

import ServicePeriod from '../containers/questions/ServicePeriod';

const mockStoreStandard = {
  getState: () => ({
    pactAct: {
      form: {
        BURN_PIT_2_1: null,
        SERVICE_PERIOD: null,
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
        SERVICE_PERIOD: null,
      },
      viewedIntroPage: false,
    },
  }),
  subscribe: () => {},
  dispatch: () => {},
};

const pushStub = sinon.stub();

const propsStandard = {
  formResponses: {
    BURN_PIT_2_1: null,
    SERVICE_PERIOD: null,
  },
  setServicePeriod: () => {},
  router: {
    push: pushStub,
  },
  viewedIntroPage: true,
};

const propsNoIntroPage = {
  formResponses: {
    BURN_PIT_2_1: null,
    SERVICE_PERIOD: RESPONSES.NINETY_OR_LATER,
  },
  setServicePeriod: () => {},
  router: {
    push: pushStub,
  },
  viewedIntroPage: false,
};

describe('Service Period Page', () => {
  afterEach(() => {
    pushStub.resetHistory();
  });

  it('should correctly load the service period page in the standard flow', () => {
    const screen = render(
      <Provider store={mockStoreStandard}>
        <ServicePeriod {...propsStandard} />
      </Provider>,
    );

    expect(screen.getByTestId('paw-servicePeriod')).to.exist;
  });

  it('should redirect to home when the intro page has not been viewed', () => {
    render(
      <Provider store={mockStoreNoIntroPage}>
        <ServicePeriod {...propsNoIntroPage} />
      </Provider>,
    );

    expect(pushStub.withArgs(ROUTES.HOME).called).to.be.true;
  });
});
