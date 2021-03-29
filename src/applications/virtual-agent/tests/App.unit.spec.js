import React from 'react';
import { expect } from 'chai';
import { waitFor, screen } from '@testing-library/react';

import App from '../containers/App';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { mockApiRequest } from 'platform/testing/unit/helpers';
import { createTestStore } from '../../vaos/tests/mocks/setup';
import { FETCH_TOGGLE_VALUES_SUCCEEDED } from 'platform/site-wide/feature-toggles/actionTypes';

describe('App', () => {
  let oldWindow;

  function loadWebChat() {
    global.window = Object.create(global.window);
    Object.assign(global.window, {
      WebChat: {
        createStore: () => {},
        createDirectLine: () => {},
        ReactWebChat: () => {
          return <div />;
        },
      },
    });
  }

  beforeEach(() => {
    oldWindow = global.window;
  });

  afterEach(() => {
    global.window = oldWindow;
  });

  describe('web chat script is loaded and greeting is shown', () => {
    it('renders web chat', () => {
      loadWebChat();

      const wrapper = renderInReduxProvider(<App />, {
        initialState: {
          featureToggles: {
            loading: false,
          },
        },
      });

      expect(wrapper.getByTestId('webchat')).to.exist;

      expect(screen.findByText('So, what can I help you with today?\n\n')).to
        .exist;
    });
  });

  describe('web chat script has not loaded', () => {
    async function wait(timeout) {
      return new Promise(resolve => {
        setTimeout(resolve, timeout);
      });
    }

    it('should wait until webchat is loaded', async () => {
      const wrapper = renderInReduxProvider(<App />, {
        initialState: {
          featureToggles: {
            loading: false,
          },
        },
      });

      expect(wrapper.getByText('waiting on webchat framework . . .')).to.exist;

      await wait(500);

      loadWebChat();

      await wait(100);

      expect(wrapper.getByTestId('webchat')).to.exist;
    });
  });

  describe('while feature flags are loading', () => {
    const getTokenCalled = () => {
      return fetch.called;
    };

    it('should not fetch token', () => {
      loadWebChat();

      mockApiRequest({});

      renderInReduxProvider(<App />, {
        initialState: {
          featureToggles: {
            loading: true,
          },
        },
      });

      expect(getTokenCalled()).to.equal(false);
    });

    it('should display loading indicator', () => {
      loadWebChat();

      mockApiRequest({});

      const wrapper = renderInReduxProvider(<App />, {
        initialState: {
          featureToggles: {
            loading: true,
          },
        },
      });

      expect(wrapper.getByRole('progressbar')).to.exist;

      expect(wrapper.queryByTestId('webchat')).to.not.exist;
    });

    it('should render web chat after loading feature toggles', async () => {
      loadWebChat();

      mockApiRequest({});

      const store = createTestStore({
        featureToggles: {
          loading: true,
        },
      });

      const wrapper = renderInReduxProvider(<App />, {
        store,
      });

      expect(getTokenCalled()).to.equal(false);

      expect(wrapper.getByRole('progressbar')).to.exist;

      store.dispatch({ type: FETCH_TOGGLE_VALUES_SUCCEEDED, payload: {} });

      expect(wrapper.getByTestId('webchat')).to.exist;

      expect(wrapper.queryByRole('progressbar')).to.not.exist;

      await waitFor(() => expect(getTokenCalled()).to.equal(true));
    });
  });
});
