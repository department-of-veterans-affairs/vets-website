import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import { App } from './App';

const initialProps = {
  handleSignInClick: () => {},
  isSignedIn: false,
};

const setup = (props = {}) => {
  const mockStore = configureMockStore([]);
  const store = mockStore({});
  return render(
    <Provider store={store}>
      <App {...initialProps} {...props} />
    </Provider>,
  );
};

describe('Priority Group Alert Widget', () => {
  it('displays <SignInPrompt /> when the user is signed out', () => {
    const wrapper = setup();
    const headerContent = 'You might already have an assigned priority group';
    expect(wrapper.findByText(headerContent)).to.exist;
    const buttonContent = 'Sign in to view your priority group';
    expect(wrapper.findByRole('button', buttonContent)).to.exist;
  });

  it('displays <PriorityGroup /> when the user is signed in', () => {
    const wrapper = setup({ isSignedIn: true });
    expect(wrapper.findByText('Your assigned priority group is')).to.exist;
  });
});
