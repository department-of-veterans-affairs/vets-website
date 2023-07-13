import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import SignInPrompt from './SignInPrompt';

const mockStore = configureMockStore([]);
const store = mockStore({});

const setup = (props = {}) =>
  render(
    <Provider store={store}>
      <SignInPrompt {...props} />
    </Provider>,
  );

describe('SignInPrompt Component', () => {
  it('renders', () => {
    const wrapper = setup();
    expect(wrapper).to.exist;
  });
});
