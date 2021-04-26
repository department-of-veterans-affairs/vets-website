import React from 'react';
import WebChat from '../containers/WebChat';
import {
  mockApiRequest,
  mockMultipleApiRequests,
} from 'platform/testing/unit/helpers';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import { CHATBOT_ERROR_MESSAGE } from './App.unit.spec';

describe('WebChat', () => {
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

  describe('on initial load', () => {
    it('should show loading indicator', () => {
      loadWebChat();
      mockApiRequest({ token: 'ANOTHERFAKETOKEN' });
      const wrapper = render(<WebChat />);

      expect(wrapper.getByRole('progressbar')).to.exist;
    });
  });

  describe('when token is valid', () => {
    it('should render web chat', async () => {
      loadWebChat();
      mockApiRequest({ token: 'FAKETOKEN' });
      const wrapper = render(<WebChat />);

      await waitFor(() => expect(wrapper.getByTestId('webchat')).to.exist);
    });
  });

  describe('when api returns error', () => {
    it('should display error message', async () => {
      loadWebChat();
      mockApiRequest({}, false);
      const wrapper = render(<WebChat />);

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

      const wrapper = render(<WebChat />);

      await waitFor(() => expect(wrapper.getByTestId('webchat')).to.exist);
    });
  });
});
