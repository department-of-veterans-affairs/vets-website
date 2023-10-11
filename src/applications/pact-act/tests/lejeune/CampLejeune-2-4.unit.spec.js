import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { ROUTES } from '../../constants';
import { RESPONSES, SHORT_NAME_MAP } from '../../constants/question-data-map';
import { displayConditionsMet } from '../../utilities/display-logic';

import Lejeune24 from '../../containers/questions/camp-lejeune/Lejeune-2-4';

const { LEJEUNE_2_4 } = SHORT_NAME_MAP;
const {
  DURING_BOTH_PERIODS,
  EIGHTYNINE_OR_EARLIER,
  ENEWETAK_ATOLL,
  GREENLAND_THULE,
  NINETY_OR_LATER,
  NO,
  NOT_SURE,
  SPAIN_PALOMARES,
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

const setLejeuneStub = sinon.stub();
const pushStub = sinon.stub();

const propsStandard = {
  formResponses: {},
  setLejeune24: setLejeuneStub,
  router: {
    push: pushStub,
  },
  viewedIntroPage: true,
};

const propsNoIntroPage = {
  formResponses: {},
  setLejeune24: setLejeuneStub,
  router: {
    push: pushStub,
  },
  viewedIntroPage: false,
};

describe('Camp Lejeune 2.4 Page', () => {
  afterEach(() => {
    setLejeuneStub.resetHistory();
    pushStub.resetHistory();
  });

  it('should correctly load the lejeune page in the standard flow', () => {
    const screen = render(
      <Provider store={mockStoreStandard}>
        <Lejeune24 {...propsStandard} />
      </Provider>,
    );

    expect(screen.getByTestId('paw-lejeune2_4')).to.exist;
  });

  describe('redirects', () => {
    it('should redirect to home when the intro page has not been viewed', () => {
      render(
        <Provider store={mockStoreNoIntroPage}>
          <Lejeune24 {...propsNoIntroPage} />
        </Provider>,
      );

      expect(pushStub.withArgs(ROUTES.HOME).called).to.be.true;
    });
  });
});

describe('displayConditionsAreMet', () => {
  it('LEJEUNE_2_4: should return true when the display conditions are met', () => {
    const formResponses = {
      RADIATION_2_3_B: [ENEWETAK_ATOLL],
      SERVICE_PERIOD: EIGHTYNINE_OR_EARLIER,
    };

    expect(displayConditionsMet(LEJEUNE_2_4, formResponses)).to.equal(true);
  });

  it('LEJEUNE_2_4: should return true when the display conditions are met', () => {
    const formResponses = {
      RADIATION_2_3_B: [GREENLAND_THULE],
      SERVICE_PERIOD: EIGHTYNINE_OR_EARLIER,
    };

    expect(displayConditionsMet(LEJEUNE_2_4, formResponses)).to.equal(true);
  });

  it('LEJEUNE_2_4: should return true when the display conditions are met', () => {
    const formResponses = {
      RADIATION_2_3_B: [SPAIN_PALOMARES],
      SERVICE_PERIOD: EIGHTYNINE_OR_EARLIER,
    };

    expect(displayConditionsMet(LEJEUNE_2_4, formResponses)).to.equal(true);
  });

  it('LEJEUNE_2_4: should return true when the display conditions are met', () => {
    const formResponses = {
      RADIATION_2_3_B: [ENEWETAK_ATOLL, SPAIN_PALOMARES],
      SERVICE_PERIOD: EIGHTYNINE_OR_EARLIER,
    };

    expect(displayConditionsMet(LEJEUNE_2_4, formResponses)).to.equal(true);
  });

  it('LEJEUNE_2_4: should return true when the display conditions are met', () => {
    const formResponses = {
      RADIATION_2_3_A: NO,
      SERVICE_PERIOD: EIGHTYNINE_OR_EARLIER,
    };

    expect(displayConditionsMet(LEJEUNE_2_4, formResponses)).to.equal(true);
  });

  it('LEJEUNE_2_4: should return true when the display conditions are met', () => {
    const formResponses = {
      RADIATION_2_3_A: NOT_SURE,
      SERVICE_PERIOD: EIGHTYNINE_OR_EARLIER,
    };

    expect(displayConditionsMet(LEJEUNE_2_4, formResponses)).to.equal(true);
  });

  it('LEJEUNE_2_4: should return true when the display conditions are met', () => {
    const formResponses = {
      RADIATION_2_3_B: [ENEWETAK_ATOLL],
      SERVICE_PERIOD: DURING_BOTH_PERIODS,
    };

    expect(displayConditionsMet(LEJEUNE_2_4, formResponses)).to.equal(true);
  });

  it('LEJEUNE_2_4: should return true when the display conditions are met', () => {
    const formResponses = {
      RADIATION_2_3_B: [GREENLAND_THULE],
      SERVICE_PERIOD: DURING_BOTH_PERIODS,
    };

    expect(displayConditionsMet(LEJEUNE_2_4, formResponses)).to.equal(true);
  });

  it('LEJEUNE_2_4: should return true when the display conditions are met', () => {
    const formResponses = {
      RADIATION_2_3_B: [SPAIN_PALOMARES],
      SERVICE_PERIOD: DURING_BOTH_PERIODS,
    };

    expect(displayConditionsMet(LEJEUNE_2_4, formResponses)).to.equal(true);
  });

  it('LEJEUNE_2_4: should return true when the display conditions are met', () => {
    const formResponses = {
      RADIATION_2_3_B: [ENEWETAK_ATOLL, SPAIN_PALOMARES],
      SERVICE_PERIOD: DURING_BOTH_PERIODS,
    };

    expect(displayConditionsMet(LEJEUNE_2_4, formResponses)).to.equal(true);
  });

  it('LEJEUNE_2_4: should return true when the display conditions are met', () => {
    const formResponses = {
      RADIATION_2_3_A: NO,
      SERVICE_PERIOD: DURING_BOTH_PERIODS,
    };

    expect(displayConditionsMet(LEJEUNE_2_4, formResponses)).to.equal(true);
  });

  it('LEJEUNE_2_4: should return true when the display conditions are met', () => {
    const formResponses = {
      RADIATION_2_3_A: NOT_SURE,
      SERVICE_PERIOD: DURING_BOTH_PERIODS,
    };

    expect(displayConditionsMet(LEJEUNE_2_4, formResponses)).to.equal(true);
  });

  it('LEJEUNE_2_4: should return false when the display conditions are not met', () => {
    const formResponses = {
      SERVICE_PERIOD: NINETY_OR_LATER,
    };

    expect(displayConditionsMet(LEJEUNE_2_4, formResponses)).to.equal(false);
  });

  it('LEJEUNE_2_4: should return false when the display conditions are not met', () => {
    const formResponses = {
      RADIATION_2_3_B: null,
      SERVICE_PERIOD: EIGHTYNINE_OR_EARLIER,
    };

    expect(displayConditionsMet(LEJEUNE_2_4, formResponses)).to.equal(false);
  });

  it('LEJEUNE_2_4: should return false when the display conditions are not met', () => {
    const formResponses = {
      RADIATION_2_3_A: YES,
      SERVICE_PERIOD: DURING_BOTH_PERIODS,
    };

    expect(displayConditionsMet(LEJEUNE_2_4, formResponses)).to.equal(false);
  });
});
