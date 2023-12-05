import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import Results1P1 from '../../containers/results/Results1-P1';
import { ROUTES } from '../../constants';

describe('Results Set 1 Page 1', () => {
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
          <Results1P1 {...propsNoIntroPage} />
        </Provider>,
      );

      expect(pushStub.withArgs(ROUTES.HOME).called).to.be.true;
    });
  });
});
