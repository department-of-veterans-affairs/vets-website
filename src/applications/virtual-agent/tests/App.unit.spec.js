import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import App from '../containers/App';

describe('App', () => {
  function setupWindowObject() {
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
  describe('web chat script is loaded', () => {
    it('renders web chat', () => {
      const oldWindow = global.window;
      setupWindowObject();

      const wrapper = render(<App />);

      expect(wrapper.getByTestId('webchat')).to.exist;

      wrapper.unmount();

      global.window = oldWindow;
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

      const oldWindow = global.window;
      setupWindowObject();

      await wait(100);

      expect(wrapper.getByTestId('webchat')).to.exist;

      wrapper.unmount();

      global.window = oldWindow;
    });
  });
});
