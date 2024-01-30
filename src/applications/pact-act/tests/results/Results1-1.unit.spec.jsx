import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import Results11 from '../../containers/results/Results1-1';
import { ROUTES } from '../../constants';

const pushStub = sinon.stub();

describe('Results Set 1 Page 1', () => {
  describe('redirects', () => {
    it('should redirect to home when the intro page has not been viewed', () => {
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
          <Results11 {...propsNoIntroPage} />
        </Provider>,
      );

      expect(pushStub.withArgs(ROUTES.HOME).called).to.be.true;
    });
  });

  describe('page load', () => {
    it('should render the page correctly when the intro page has been viewed', () => {
      const mockStore = {
        getState: () => ({
          pactAct: {
            form: {},
            viewedIntroPage: true,
          },
        }),
        subscribe: () => {},
        dispatch: () => () => {},
      };

      const props = {
        formResponses: {},
        router: {
          push: pushStub,
        },
        viewedIntroPage: true,
      };

      const screen = render(
        <Provider store={mockStore}>
          <Results11 {...props} />
        </Provider>,
      );
      expect(screen.getByTestId('paw-results-1-1')).to.exist;
    });
  });
});
