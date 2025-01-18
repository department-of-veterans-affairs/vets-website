import React from 'react';
import { Provider } from 'react-redux';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { CSP_IDS } from '~/platform/user/authentication/constants';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import UnverifiedAlert from '../../../components/messages/UnverifiedAlert';

describe('Unverified Alert component', () => {
  const mockStore = (serviceName = CSP_IDS.IDME) => ({
    getState: () => ({
      user: { profile: { signIn: { serviceName } } },
    }),
    dispatch: () => {},
    subscribe: () => {},
  });

  it('renders single button', () => {
    const { container } = render(
      <Provider store={mockStore()}>
        <UnverifiedAlert />
      </Provider>,
    );

    const signInAlert = $('va-alert-sign-in', container);
    const signInButton = $('.idme-verify-button', container);

    expect(signInAlert).to.exist;
    expect(signInAlert.getAttribute('variant')).to.eql('verifyIdMe');
    expect(signInAlert.getAttribute('heading-level')).to.eql('2');

    fireEvent.click(signInButton);

    expect(signInButton).to.exist;
  });

  it('with header level 3', () => {
    const { container } = render(
      <Provider store={mockStore()}>
        <UnverifiedAlert headerLevel={3} />
      </Provider>,
    );
    const signInAlert = $('va-alert-sign-in', container);
    expect(signInAlert.getAttribute('heading-level')).to.eql('3');
  });

  it('renders MHV account alert', () => {
    const { container } = render(
      <Provider store={mockStore(CSP_IDS.MHV)}>
        <UnverifiedAlert />
      </Provider>,
    );
    const signInAlert = $('va-alert-sign-in', container);
    expect(signInAlert.getAttribute('variant')).to.eql('signInEither');
    expect($('.idme-verify-button', container)).to.exist;
    expect($('.logingov-verify-button', container)).to.exist;
  });

  it('reports analytics', async () => {
    const recordEventSpy = sinon.spy();
    render(
      <Provider store={mockStore()}>
        <UnverifiedAlert recordEvent={recordEventSpy} />
      </Provider>,
    );
    await waitFor(() => {
      expect(recordEventSpy.calledOnce).to.be.true;
    });
  });
});
