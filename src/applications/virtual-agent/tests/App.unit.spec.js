import React from 'react';
import { expect } from 'chai';
import { waitFor } from '@testing-library/react';

import App from '../components/app/App';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import {
  mockApiRequest,
  resetFetch,
  mockMultipleApiRequests,
} from 'platform/testing/unit/helpers';
import { createTestStore } from '../../vaos/tests/mocks/setup';
import { FETCH_TOGGLE_VALUES_SUCCEEDED } from 'platform/site-wide/feature-toggles/actionTypes';

export const CHATBOT_ERROR_MESSAGE =
  'We’re making some updates to the Virtual Agent. We’re sorry it’s not working right now. Please check back soon. If you require immediate assistance please call the VA.gov help desk at 800-698-2411 (TTY: 711).';

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
    resetFetch();
    oldWindow = global.window;
  });

  afterEach(() => {
    resetFetch();
    global.window = oldWindow;
  });

  describe('web chat script is already loaded', () => {
    it('renders web chat', async () => {
      loadWebChat();
      mockApiRequest({});

      const wrapper = renderInReduxProvider(<App />, {
        initialState: {
          featureToggles: {
            loading: false,
          },
        },
      });

      await waitFor(
        () => expect(wrapper.getByTestId('webchat-container')).to.exist,
      );
    });
  });

  describe('web chat script has not loaded', () => {
    async function wait(timeout) {
      return new Promise(resolve => {
        setTimeout(resolve, timeout);
      });
    }

    it('should not render webchat until webchat framework is loaded', async () => {
      mockApiRequest({});

      const wrapper = renderInReduxProvider(<App webchatTimeout={1000} />, {
        initialState: {
          featureToggles: {
            loading: false,
          },
        },
      });

      expect(wrapper.getByRole('progressbar')).to.exist;
      expect(wrapper.queryByTestId('webchat-container')).to.not.exist;

      await wait(500);

      loadWebChat();

      await waitFor(
        () => expect(wrapper.getByTestId('webchat-container')).to.exist,
      );
    });

    it('should display error if webchat does not load after x milliseconds', async () => {
      mockApiRequest({});

      const wrapper = renderInReduxProvider(<App webchatTimeout={1500} />, {
        initialState: {
          featureToggles: {
            loading: false,
          },
        },
      });

      expect(wrapper.getByRole('progressbar')).to.exist;

      await wait(2000);

      loadWebChat();

      await waitFor(
        () => expect(wrapper.getByText(CHATBOT_ERROR_MESSAGE)).to.exist,
      );

      expect(wrapper.queryByRole('progressbar')).to.not.exist;
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

    it('should call token api after loading feature toggles', async () => {
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

      await waitFor(() => expect(getTokenCalled()).to.equal(true));
    });
  });

  describe('on initial load', () => {
    it('should show loading indicator', () => {
      loadWebChat();
      mockApiRequest({ token: 'ANOTHERFAKETOKEN' });
      const wrapper = renderInReduxProvider(<App />, {
        initialState: {
          featureToggles: {
            loading: false,
          },
        },
      });

      expect(wrapper.getByRole('progressbar')).to.exist;
    });
  });

  describe('when token is valid', () => {
    it('should render web chat', async () => {
      loadWebChat();
      mockApiRequest({ token: 'FAKETOKEN' });
      const wrapper = renderInReduxProvider(<App />, {
        initialState: {
          featureToggles: {
            loading: false,
          },
        },
      });

      await waitFor(() => expect(wrapper.getByTestId('webchat')).to.exist);
    });
  });

  describe('when api returns error', () => {
    it('should display error message', async () => {
      loadWebChat();
      mockApiRequest({}, false);
      const wrapper = renderInReduxProvider(<App />, {
        initialState: {
          featureToggles: {
            loading: false,
          },
        },
      });

      await waitFor(
        () => expect(wrapper.getByText(CHATBOT_ERROR_MESSAGE)).to.exist,
      );
    });
  });

  describe('when api returns error one time, but works after a retry', () => {
    it('should render web chat', async () => {
      loadWebChat();
      mockMultipleApiRequests([
        { response: {}, shouldResolve: false },
        { response: { token: 'FAKETOKEN' }, shouldResolve: true },
      ]);

      const wrapper = renderInReduxProvider(<App />, {
        initialState: {
          featureToggles: {
            loading: false,
          },
        },
      });

      await waitFor(() => expect(wrapper.getByTestId('webchat')).to.exist);
    });
  });
});
