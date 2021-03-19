import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import App from '../containers/App';

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

  describe('web chat script is loaded', () => {
    it('renders web chat', () => {
      loadWebChat();

      const wrapper = render(<App />);

      expect(wrapper.getByTestId('webchat')).to.exist;
    });
  });

  describe('web chat script has not loaded', () => {
    async function wait(timeout) {
      return new Promise(resolve => {
        setTimeout(resolve, timeout);
      });
    }

    it('should wait until webchat is loaded', async () => {
      const wrapper = render(<App />);

      expect(wrapper.getByText('waiting on webchat framework . . .')).to.exist;

      await wait(500);

      loadWebChat();

      await wait(100);

      expect(wrapper.getByTestId('webchat')).to.exist;
    });
  });
});
