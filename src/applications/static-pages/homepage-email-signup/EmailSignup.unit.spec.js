import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
// import { fireEvent, render } from '@testing-library/react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import EmailSignup from './EmailSignup';

describe('homepage email signup', () => {
  const store = createStore(() => {});

  it('should load the email signup form as expected', () => {
    expect(true).toBe(true);
    const { container } = render(
      <Provider store={store}>
        <EmailSignup />
      </Provider>,
    );

    expect(container.querySelector('#email-signup-form')).exist;
  });
});
