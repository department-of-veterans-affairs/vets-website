import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { RESPONSES } from '../../constants/question-data-map';
import { ROUTES } from '../../constants';

import DischargeMonth from '../../components/v2/questions/DischargeMonth';

const mockStoreStandard = {
  getState: () => ({
    dischargeUpgradeWizard: {
      duwForm: {
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
      duwForm: {
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
    SERVICE_BRANCH: RESPONSES.ARMY,
    DISCHARGE_YEAR: 2009,
    DISCHARGE_MONTH: null,
  },
  setDischargeMonth: () => {},
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
  setDischargeMonth: () => {},
  router: {
    push: pushStub,
  },
  viewedIntroPage: false,
};

describe('Discharge Month Page', () => {
  afterEach(() => {
    pushStub.resetHistory();
  });

  it('should correctly load the discharge month page in the standard flow', () => {
    const screen = render(
      <Provider store={mockStoreStandard}>
        <DischargeMonth {...propsStandard} />
      </Provider>,
    );

    expect(screen.getByTestId('duw-discharge_month')).to.exist;
  });

  it('should redirect to home when the intro page has not been viewed', () => {
    render(
      <Provider store={mockStoreNoIntroPage}>
        <DischargeMonth {...propsNoIntroPage} />
      </Provider>,
    );

    expect(pushStub.withArgs(ROUTES.HOME).called).to.be.true;
  });
});
