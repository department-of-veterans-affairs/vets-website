import React, { useEffect } from 'react';
import sinon from 'sinon';
import {
  mockApiRequest,
  mockMultipleApiRequests,
} from 'platform/testing/unit/helpers';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { waitFor } from '@testing-library/react';
import { expect } from 'chai';
import { CHATBOT_ERROR_MESSAGE } from './App.unit.spec';
import App from '../containers/App';

describe('WebChat', () => {
  let oldWindow;

  function loadWebChat({ ReactWebChat } = {}) {
    global.window = Object.create(global.window);

    const defaultReactWebChat = () => {
      return <div />;
    };

    Object.assign(global.window, {
      WebChat: {
        createStore: () => {},
        createDirectLine: () => {},
        ReactWebChat: ReactWebChat || defaultReactWebChat,
      },
    });
  }

  beforeEach(() => {
    oldWindow = global.window;
  });

  afterEach(() => {
    global.window = oldWindow;
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

  describe('weird unmounting behavior of webchat framework', () => {
    it('should not unmount, otherwise the directLine is closed and the conversation can`t start', async () => {
      const onUnmount = sinon.spy();

      const ReactWebChat = () => {
        useEffect(() => {
          return onUnmount;
        });

        return <div />;
      };

      loadWebChat({ ReactWebChat });

      mockApiRequest({ token: 'FAKETOKEN' });

      const wrapper = renderInReduxProvider(<App />, {
        initialState: {
          featureToggles: {
            loading: false,
          },
        },
      });

      await waitFor(() => expect(wrapper.getByTestId('webchat')).to.exist);
      expect(onUnmount.called).to.be.false;
    });
  });
});
