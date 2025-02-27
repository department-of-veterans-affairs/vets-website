import React from 'react';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import { waitFor, cleanup } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { CSP_IDS } from '~/platform/user/authentication/constants';
import UnverifiedAlert from '../../../components/messages/UnverifiedAlert';

const generateStore = ({ serviceName = 'idme' } = {}) => ({
  user: { profile: { signIn: { serviceName } } },
});

describe('Unverified Alert component', () => {
  const initialState = generateStore();
  afterEach(cleanup);

  it('renders', () => {
    const { container } = renderInReduxProvider(<UnverifiedAlert />, {
      initialState,
    });
    const signInAlert = container.querySelector('va-alert-sign-in');
    expect(signInAlert).to.exist;
  });

  it('with header level 3', () => {
    const { container } = renderInReduxProvider(
      <UnverifiedAlert headerLevel={3} />,
      {
        initialState,
      },
    );
    const signInAlert = container.querySelector('va-alert-sign-in');
    expect(signInAlert).to.exist;
    expect(signInAlert.getAttribute('heading-level')).to.eql('3');
  });

  it('renders MHV account alert', () => {
    const { container } = renderInReduxProvider(<UnverifiedAlert />, {
      initialState: generateStore({ serviceName: CSP_IDS.MHV }),
    });
    const signInAlert = container.querySelector('va-alert-sign-in');
    expect(signInAlert).to.exist;
    expect(signInAlert.getAttribute('variant')).to.eql('signInEither');
  });

  it('renders alert for Login.gov account', () => {
    const { container } = renderInReduxProvider(<UnverifiedAlert />, {
      initialState: generateStore({ serviceName: CSP_IDS.LOGIN_GOV }),
    });
    const signInAlert = container.querySelector('va-alert-sign-in');
    expect(signInAlert).to.exist;
    expect(signInAlert.getAttribute('variant')).to.eql('verifyLoginGov');
  });

  it('renders alert for ID.me account', () => {
    const { container } = renderInReduxProvider(<UnverifiedAlert />, {
      initialState: generateStore({ serviceName: CSP_IDS.ID_ME }),
    });
    const signInAlert = container.querySelector('va-alert-sign-in');
    expect(signInAlert).to.exist;
    expect(signInAlert.getAttribute('variant')).to.eql('verifyIdMe');
  });

  it('reports analytics', async () => {
    const recordEventSpy = sinon.spy();
    renderInReduxProvider(<UnverifiedAlert recordEvent={recordEventSpy} />, {
      initialState,
    });
    await waitFor(() => {
      expect(recordEventSpy.calledOnce).to.be.true;
    });
  });
});
