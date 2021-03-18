import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import App from '../containers/App';
import ReactWebChat from 'botframework-webchat';

describe('App', () => {
  describe('web chat script is loaded', () => {
    const setupWindowObject = () => {
      global.window = Object.create(global.window);
      Object.assign(global.window, {
        WebChat: {
          createStore: () => {},
          createDirectLine: () => {},
          ReactWebChat: props => {
            return <ReactWebChat {...props.children} />;
          },
        },
      });
    };

    it('renders web chat', () => {
      const oldWindow = global.window;
      setupWindowObject();

      const wrapper = render(<App />);

      expect(wrapper.find('ReactWebChat')).length.to.equal(1);

      wrapper.unmount();

      global.window = oldWindow;
    });
  });
});
