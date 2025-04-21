import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect } from 'chai';
import React from 'react';
import { Provider } from 'react-redux';
import sinon from 'sinon';
import SignInInterruptPage from '../../containers/SignInInterruptPage';
import { getData } from '../fixtures/data/mock-form-data';

describe('SignInInterruptPage', () => {
  it('should show sign in alert and back button', () => {
    const { props, mockStore } = getData({ loggedIn: false });
    const goBack = sinon.spy();

    const { container } = render(
      <Provider store={mockStore}>
        <SignInInterruptPage {...props} goBack={goBack} />
      </Provider>,
    );

    expect(
      container.querySelector('va-alert-sign-in[variant="signInRequired"]'),
    ).to.exist;
    expect(
      container.querySelector('va-button[text="Sign in or create an account"]'),
    ).to.exist;
    expect(container.querySelector('button.usa-button-secondary')).to.exist;
  });

  it('should navigate back when clicking back button', () => {
    const { props, mockStore } = getData({ loggedIn: false });
    const goBack = sinon.spy();

    const { container } = render(
      <Provider store={mockStore}>
        <SignInInterruptPage {...props} goBack={goBack} />
      </Provider>,
    );

    const backButton = container.querySelector('button.usa-button-secondary');
    userEvent.click(backButton);
    expect(goBack.called).to.be.true;
  });

  it.skip('should redirect to forward page when logged in', async () => {
    const { props, mockStore } = getData({ loggedIn: true });
    const goForward = sinon.spy();

    render(
      <Provider store={mockStore}>
        <SignInInterruptPage {...props} goForward={goForward} />
      </Provider>,
    );

    await waitFor(() => {
      expect(goForward.called).to.be.true;
    });
  });

  it('should navigate to introduction with modal flag when clicking sign in', () => {
    const { props, mockStore } = getData({ loggedIn: false });
    const oldLocation = window.location;
    delete window.location;
    window.location = { href: '' };

    const { container } = render(
      <Provider store={mockStore}>
        <SignInInterruptPage {...props} />
      </Provider>,
    );

    const signInButton = container.querySelector('va-button');
    userEvent.click(signInButton);

    expect(window.location.href).to.contain(
      'introduction?showSignInModal=true',
    );
    window.location = oldLocation;
  });
});
