import React from 'react';
import { Provider } from 'react-redux';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { $ } from 'platform/forms-system/src/js/utilities/ui';
import UnauthenticatedAlert from '../../../components/messages/UnauthenticatedAlert';

describe('Unauthenticated Alert component', () => {
  const mockStore = {
    getState: () => ({}),
    subscribe: () => {},
    dispatch: () => {},
  };

  it('renders without service description', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <UnauthenticatedAlert />
      </Provider>,
    );

    const signInAlert = $('va-alert-sign-in', container);
    const signInButton = $('va-button', container);
    expect(signInAlert).to.exist;
    expect(signInAlert.getAttribute('variant')).to.eql('signInRequired');
    expect(signInAlert.getAttribute('heading-level')).to.eql('2');

    fireEvent.click(signInButton);

    expect(signInButton).to.exist;
  });

  it('with header level 3', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <UnauthenticatedAlert headerLevel={3} />
      </Provider>,
    );
    expect(
      $('va-alert-sign-in', container).getAttribute('heading-level'),
    ).to.eql('3');
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
