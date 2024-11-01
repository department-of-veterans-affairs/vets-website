import React from 'react';
import { Provider } from 'react-redux';
import EmailSignup from './EmailSignup';
import { createStore } from 'redux';
import { fireEvent, render } from '@testing-library/react';
import { expect } from 'chai';

describe('homepage email signup', () => {
  const store = createStore(() => {});

  it('should load the email signup form as expected', () => {
    const { container } = render(
      <Provider store={store}>
        <EmailSignup />
      </Provider>,
    );

    console.log('container: ', container.innerHTML);

    expect(container.querySelector('#email-signup-form')).to.exist;
    expect(container.querySelectorAll('input[type="hidden"]').length).to.equal(3);
  });
});
