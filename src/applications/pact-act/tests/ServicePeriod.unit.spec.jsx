import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { ROUTES } from '../constants';
import { RESPONSES } from '../constants/question-data-map';
import { displayConditionsMet } from '../utilities/display-logic-questions';

import ServicePeriod from '../containers/questions/ServicePeriod';

// Form data is intentionally skipped for the render tests since these are very basic "does it load?" tests

// This file contains tests for the component's display as well as testing displayConditionsMet
// for this question specifically

const mockStore = {
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

const props = {
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

  it('should correctly load the service period page', () => {
    const screen = render(
      <Provider store={mockStore}>
        <ServicePeriod {...props} />
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

describe('displayConditionsAreMet', () => {
  it('SERVICE PERIOD: should return true when the display conditions are met', () => {
    const formResponses = {};

    expect(displayConditionsMet('SERVICE_PERIOD', formResponses)).to.equal(
      true,
    );
  });
});
