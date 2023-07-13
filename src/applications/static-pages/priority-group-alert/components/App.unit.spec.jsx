import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import { App } from './App';

const mockStore = configureMockStore([]);
const store = mockStore({});

const setup = (props = {}) =>
  render(
    <Provider store={store}>
      <App {...props} />
    </Provider>,
  );

describe('Priority Group Alert Widget', () => {
  it('displays <SignInPrompt /> when the user is signed out', () => {
    const wrapper = setup({ isSignedIn: false });
    expect(
      wrapper.findByText('You might already have an assigned priority group'),
    ).to.exist;
    expect(wrapper.findByRole('button', 'Sign in to view your priority group'))
      .to.exist;
  });

  it('displays <PriorityGroup /> when the user is signed in', () => {
    const wrapper = setup({ isSignedIn: false });
    expect(wrapper.findByText('Your assigned priority group is')).to.exist;
  });
});
