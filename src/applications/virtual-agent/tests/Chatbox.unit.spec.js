import React from 'react';
import ReactDOM from 'react-dom';
import { expect } from 'chai';
import { waitFor, screen } from '@testing-library/react';
import sinon from 'sinon';

import Chatbox from '../components/chatbox/Chatbox';
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
  let directLineSpy;

  function loadWebChat() {
    global.window = Object.create(global.window);
    Object.assign(global.window, {
      WebChat: {
        createStore: () => {},
        createDirectLine: directLineSpy,
        ReactWebChat: () => {
          return <div />;
        },
      },
    });
  }

  beforeEach(() => {
    directLineSpy = sinon.spy();
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

      const wrapper = renderInReduxProvider(<Chatbox />, {
        initialState: {
          featureToggles: {
            loading: false,
          },
        },
      });

      await waitFor(() => expect(wrapper.getByTestId('webchat')).to.exist);
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

      const wrapper = renderInReduxProvider(<Chatbox webchatTimeout={1000} />, {
        initialState: {
          featureToggles: {
            loading: false,
          },
        },
      });

      expect(wrapper.getByRole('progressbar')).to.exist;
      expect(wrapper.queryByTestId('webchat')).to.not.exist;

      await wait(500);

      loadWebChat();

      await waitFor(() => expect(wrapper.getByTestId('webchat')).to.exist);
    });

    it('should display error if webchat does not load after x milliseconds', async () => {
      mockApiRequest({});

      const wrapper = renderInReduxProvider(<Chatbox webchatTimeout={1500} />, {
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

      renderInReduxProvider(<Chatbox />, {
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

      const wrapper = renderInReduxProvider(<Chatbox />, {
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

      const wrapper = renderInReduxProvider(<Chatbox />, {
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
      const wrapper = renderInReduxProvider(<Chatbox />, {
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
      const wrapper = renderInReduxProvider(<Chatbox />, {
        initialState: {
          featureToggles: {
            loading: false,
          },
        },
      });

      await waitFor(() => expect(wrapper.getByTestId('webchat')).to.exist);

      expect(directLineSpy.called).to.be.true;
      expect(
        directLineSpy.calledWith({
          token: 'FAKETOKEN',
          domain:
            'https://northamerica.directline.botframework.com/v3/directline',
        }),
      ).to.be.true;
    });
  });

  describe('when api returns error', () => {
    it('should display error message', async () => {
      loadWebChat();
      mockApiRequest({}, false);
      const wrapper = renderInReduxProvider(<Chatbox />, {
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

      const wrapper = renderInReduxProvider(<Chatbox />, {
        initialState: {
          featureToggles: {
            loading: false,
          },
        },
      });

      await waitFor(() => expect(wrapper.getByTestId('webchat')).to.exist);
    });
  });

  describe('when chatbox is rendered', () => {
    it('loads the webchat framework via script tag', () => {
      expect(screen.queryByTestId('webchat-framework-script')).to.not.exist;

      const wrapper = renderInReduxProvider(<Chatbox webchatTimeout={10} />);

      expect(wrapper.getByTestId('webchat-framework-script')).to.exist;
    });

    it('loads the webchat framework only once', async () => {
      loadWebChat();
      mockApiRequest({ token: 'FAKETOKEN' });
      const wrapper = renderInReduxProvider(<Chatbox />, {
        initialState: {
          featureToggles: {
            loading: false,
          },
        },
      });

      await waitFor(() => expect(wrapper.getByTestId('webchat')).to.exist);
      expect(
        wrapper.queryAllByTestId('webchat-framework-script'),
      ).to.have.lengthOf(1);
    });

    it('exposes React and ReactDOM as globals for the framework to re-use so hooks still work', () => {
      expect(window.React).to.not.exist;
      expect(window.ReactDOM).to.not.exist;

      renderInReduxProvider(<Chatbox webchatTimeout={10} />);

      expect(window.React).to.eql(React);
      expect(window.ReactDOM).to.eql(ReactDOM);
    });
  });
});
