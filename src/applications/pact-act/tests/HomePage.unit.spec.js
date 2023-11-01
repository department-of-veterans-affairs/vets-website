import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import HomePage from '../containers/HomePage';

const mockStoreStandard = {
  getState: () => {},
  subscribe: () => {},
  dispatch: () => {},
};

const propsStandard = {
  setIntroPageViewed: () => {},
  router: {
    push: () => {},
  },
};

describe('Home Page', () => {
  it('should correctly load the home page in the standard flow', () => {
    const screen = render(
      <Provider store={mockStoreStandard}>
        <HomePage {...propsStandard} />
      </Provider>,
    );

    expect(screen.getByTestId('paw-start-form')).to.exist;
  });
});
