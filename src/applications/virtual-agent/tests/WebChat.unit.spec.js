import React from 'react';
import WebChat from '../containers/WebChat';
import { mockApiRequest } from 'platform/testing/unit/helpers';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';

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

  describe('when token is valid', () => {
    it('should render web chat', async () => {
      loadWebChat();
      mockApiRequest({ token: 'FAKETOKEN' });
      const wrapper = render(<WebChat />);

      await waitFor(() => expect(wrapper.getByTestId('webchat')).to.exist);
    });
  });
});
