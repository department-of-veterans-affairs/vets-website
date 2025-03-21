import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import HomePage from '../containers/HomePage';

const mockStore = {
  getState: () => {},
  subscribe: () => {},
  dispatch: () => {},
};

const props = {
  setIntroPageViewed: () => {},
  router: {
    push: () => {},
  },
};

describe('Home Page', () => {
  it('should correctly load the home page', () => {
    const screen = render(
      <Provider store={mockStore}>
        <HomePage {...props} />
      </Provider>,
    );

    expect(screen.getByTestId('paw-start-form')).to.exist;
  });
});
