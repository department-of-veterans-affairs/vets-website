import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import EmailSignup from './EmailSignup';

describe('homepage email signup', () => {
  const store = createStore(() => {});

  it('should load the email signup form as expected', () => {
    const { container } = render(
      <Provider store={store}>
        <EmailSignup />
      </Provider>,
    );

    expect(container.querySelector('#email-signup-form')).to.exist;
    expect(container.querySelectorAll('input[type="hidden"]').length).to.equal(
      3,
    );
    expect(container.querySelector('.homepage-email-input')).to.exist;
    expect(container.querySelector('va-button')).to.exist;
  });

  it('should not show an error message by default', () => {
    const screen = render(
      <Provider store={store}>
        <EmailSignup />
      </Provider>,
    );

    expect(
      screen.queryByText(
        'Enter a valid email address without spaces using this format: email@domain.com',
      ),
    ).not.to.exist;
  });
});
