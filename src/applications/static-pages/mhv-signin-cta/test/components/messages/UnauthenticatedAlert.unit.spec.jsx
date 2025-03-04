import React from 'react';
import { waitFor, cleanup } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import UnauthenticatedAlert from '../../../components/messages/UnauthenticatedAlert';

describe('Unauthenticated Alert component', () => {
  const initialState = {};

  afterEach(cleanup);

  it('renders va-alert-sign-in', () => {
    const { container } = renderInReduxProvider(<UnauthenticatedAlert />, {
      initialState,
    });

    const signInAlert = container.querySelector('va-alert-sign-in');
    expect(signInAlert).to.exist;
    expect(signInAlert.getAttribute('variant')).to.eql('signInRequired');
  });

  it('with header level 4', () => {
    const { container } = renderInReduxProvider(
      <UnauthenticatedAlert headerLevel={4} />,
      { initialState },
    );

    const signInAlert = container.querySelector('va-alert-sign-in');
    expect(signInAlert).to.exist;
    expect(signInAlert.getAttribute('heading-level')).to.eql('4');
  });

  it('reports analytics', async () => {
    const recordEventSpy = sinon.spy();
    renderInReduxProvider(
      <UnauthenticatedAlert recordEvent={recordEventSpy} />,
      { initialState },
    );
    await waitFor(() => {
      expect(recordEventSpy.calledOnce).to.be.true;
    });
  });
});
