import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import App from '../containers/App';

describe('App', () => {
  describe('web chat script is loaded', () => {
    const setupWindowObject = () => {
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
    };

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
    it('renders loading message', () => {
      const wrapper = render(<App />);

      expect(wrapper.getByText('waiting on webchat framework . . .')).to.exist;
    });
  });
});
