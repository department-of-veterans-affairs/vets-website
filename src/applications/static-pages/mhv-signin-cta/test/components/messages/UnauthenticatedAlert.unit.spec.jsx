import React from 'react';
import { Provider } from 'react-redux';
import { render, waitFor, cleanup } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import UnauthenticatedAlert from '../../../components/messages/UnauthenticatedAlert';

describe('Unauthenticated Alert component', () => {
  const mockStore = {
    getState: () => ({}),
    dispatch: () => {},
    subscribe: () => {},
  };

  afterEach(cleanup);

  it('renders va-alert-sign-in', async () => {
    const { container } = render(
      <Provider store={mockStore}>
        <UnauthenticatedAlert />
      </Provider>,
    );

    await waitFor(() => {
      const signInAlert = container.querySelector('va-alert-sign-in');
      expect(signInAlert).to.exist;
      expect(signInAlert.getAttribute('variant')).to.eql('signInRequired');
    });
  });

  it('with header level 3', async () => {
    const { container } = render(
      <Provider store={mockStore}>
        <UnauthenticatedAlert headerLevel={4} />
      </Provider>,
    );

    await waitFor(() => {
      const signInAlert = container.querySelector('va-alert-sign-in');
      expect(signInAlert).to.exist;
      expect(signInAlert.getAttribute('heading-level')).to.eql('4');
    });
  });

  it('reports analytics', async () => {
    const recordEventSpy = sinon.spy();
    render(
      <Provider store={mockStore}>
        <UnauthenticatedAlert recordEvent={recordEventSpy} />
      </Provider>,
    );
    await waitFor(() => {
      expect(recordEventSpy.calledOnce).to.be.true;
    });
  });
});
