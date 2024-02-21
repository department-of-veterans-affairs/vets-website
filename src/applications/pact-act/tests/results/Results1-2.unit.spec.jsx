import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import Results12 from '../../containers/results/Results1-2';
import { RESPONSES } from '../../constants/question-data-map';
import { ROUTES } from '../../constants';

describe('Results Set 1 Page 2', () => {
  describe('redirects', () => {
    it('should redirect to home when the intro page has not been viewed', () => {
      const pushStub = sinon.stub();

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

      const propsNoIntroPage = {
        formResponses: {},
        router: {
          push: pushStub,
        },
        viewedIntroPage: false,
      };

      render(
        <Provider store={mockStoreNoIntroPage}>
          <Results12 {...propsNoIntroPage} />
        </Provider>,
      );

      expect(pushStub.withArgs(ROUTES.HOME).called).to.be.true;
    });
  });

  describe('displaying dynamic burn pit paragraph', () => {
    const mockStore = {
      getState: () => ({
        pactAct: {
          form: {
            SERVICE_PERIOD: RESPONSES.NINETY_OR_LATER,
            BURN_PIT_2_1: RESPONSES.NO,
            BURN_PIT_2_1_1: RESPONSES.NOT_SURE,
            BURN_PIT_2_1_2: RESPONSES.YES,
          },
          viewedIntroPage: true,
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };

    it('should correctly load the results page', () => {
      const screen = render(
        <Provider store={mockStore}>
          <Results12 formResponses={{}} router={() => {}} viewedIntroPage />,
        </Provider>,
      );

      expect(screen.getByTestId('paw-results-1-2-burn-pits')).to.exist;
    });
  });

  describe('displaying dynamic agent orange / lejeune paragraph', () => {
    const mockStore = {
      getState: () => ({
        pactAct: {
          form: {
            SERVICE_PERIOD: RESPONSES.DURING_BOTH_PERIODS,
            BURN_PIT_2_1: RESPONSES.NO,
            BURN_PIT_2_1_1: RESPONSES.NOT_SURE,
            BURN_PIT_2_1_2: RESPONSES.YES,
            ORANGE_2_2_A: RESPONSES.YES,
          },
          viewedIntroPage: true,
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };

    it('should correctly load the results page', () => {
      const screen = render(
        <Provider store={mockStore}>
          <Results12 formResponses={{}} router={() => {}} viewedIntroPage />,
        </Provider>,
      );

      expect(screen.getByTestId('paw-results-1-2-o22-lejeune')).to.exist;
    });
  });

  describe('displaying dynamic agent orange / lejeune paragraph', () => {
    const mockStore = {
      getState: () => ({
        pactAct: {
          form: {
            SERVICE_PERIOD: RESPONSES.DURING_BOTH_PERIODS,
            BURN_PIT_2_1: RESPONSES.NO,
            BURN_PIT_2_1_1: RESPONSES.NOT_SURE,
            BURN_PIT_2_1_2: RESPONSES.YES,
            ORANGE_2_2_A: RESPONSES.NO,
            ORANGE_2_2_1_A: RESPONSES.NO,
            ORANGE_2_2_2: RESPONSES.NO,
            ORANGE_2_2_3: RESPONSES.NO,
            RADIATION_2_3_A: RESPONSES.NO,
            LEJEUNE_2_4: RESPONSES.YES,
          },
          viewedIntroPage: true,
        },
      }),
      subscribe: () => {},
      dispatch: () => {},
    };

    it('should correctly load the results page', () => {
      const screen = render(
        <Provider store={mockStore}>
          <Results12 formResponses={{}} router={() => {}} viewedIntroPage />,
        </Provider>,
      );

      expect(screen.getByTestId('paw-results-1-2-o22-lejeune')).to.exist;
    });
  });
});
