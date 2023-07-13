import React from 'react';
import { renderInReduxProvider } from '@department-of-veterans-affairs/platform-testing/react-testing-library-helpers';
import App from './App';

const initialState = { isSignedIn: false };

const setup = (state = initialState) =>
  renderInReduxProvider(<App />, { initialState: state });

describe('Priority Group Alert Widget', () => {
  it('renders', () => {
    const screen = setup();
    expect(screen);
  });
});
