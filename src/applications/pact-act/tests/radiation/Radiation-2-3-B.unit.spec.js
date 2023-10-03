import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { ROUTES } from '../../constants';
import { RESPONSES, SHORT_NAME_MAP } from '../../constants/question-data-map';
import { displayConditionsMet } from '../../utilities/display-logic';

import Radiation23B from '../../containers/questions/radiation/Radiation-2-3-B';

const { RADIATION_2_3_B } = SHORT_NAME_MAP;
const {
  DURING_BOTH_PERIODS,
  EIGHTYNINE_OR_EARLIER,
  NINETY_OR_LATER,
  NO,
  YES,
} = RESPONSES;

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

const setRadiationStub = sinon.stub();
const pushStub = sinon.stub();

const propsStandard = {
  formResponses: {},
  setRadiation23B: setRadiationStub,
  router: {
    push: pushStub,
  },
  viewedIntroPage: true,
};

const propsNoIntroPage = {
  formResponses: {},
  setRadiation23B: setRadiationStub,
  router: {
    push: pushStub,
  },
  viewedIntroPage: false,
};

describe('Radiation 2.3.B Page', () => {
  afterEach(() => {
    setRadiationStub.resetHistory();
    pushStub.resetHistory();
  });

  it('should correctly load the radiation page in the standard flow', () => {
    const screen = render(
      <Provider store={mockStoreStandard}>
        <Radiation23B {...propsStandard} />
      </Provider>,
    );

    expect(screen.getByTestId('paw-radiation2_3_B')).to.exist;
  });

  describe('redirects', () => {
    it('should redirect to home when the intro page has not been viewed', () => {
      render(
        <Provider store={mockStoreNoIntroPage}>
          <Radiation23B {...propsNoIntroPage} />
        </Provider>,
      );

      expect(pushStub.withArgs(ROUTES.HOME).called).to.be.true;
    });
  });
});

describe('displayConditionsAreMet', () => {
  it('RADIATION_2_3_B: should return true when the display conditions are met', () => {
    const formResponses = {
      RADIATION_2_3_A: YES,
      SERVICE_PERIOD: EIGHTYNINE_OR_EARLIER,
    };

    expect(displayConditionsMet(RADIATION_2_3_B, formResponses)).to.equal(true);
  });

  it('RADIATION_2_3_B: should return true when the display conditions are met', () => {
    const formResponses = {
      RADIATION_2_3_A: YES,
      SERVICE_PERIOD: DURING_BOTH_PERIODS,
    };

    expect(displayConditionsMet(RADIATION_2_3_B, formResponses)).to.equal(true);
  });

  it('RADIATION_2_3_B: should return false when the display conditions are not met', () => {
    const formResponses = {
      SERVICE_PERIOD: NINETY_OR_LATER,
    };

    expect(displayConditionsMet(RADIATION_2_3_B, formResponses)).to.equal(
      false,
    );
  });

  it('RADIATION_2_3_B: should return false when the display conditions are not met', () => {
    const formResponses = {
      RADIATION_2_3_A: NO,
      SERVICE_PERIOD: EIGHTYNINE_OR_EARLIER,
    };

    expect(displayConditionsMet(RADIATION_2_3_B, formResponses)).to.equal(
      false,
    );
  });

  it('RADIATION_2_3_B: should return false when the display conditions are not met', () => {
    const formResponses = {
      RADIATION_2_3_A: NO,
      SERVICE_PERIOD: DURING_BOTH_PERIODS,
    };

    expect(displayConditionsMet(RADIATION_2_3_B, formResponses)).to.equal(
      false,
    );
  });
});
