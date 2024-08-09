import React from 'react';
import createMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { CSP_IDS } from '~/platform/user/authentication/constants';
import UnverifiedAlert, {
  headingPrefix,
} from '../../../components/messages/UnverifiedAlert';

const mockStore = createMockStore([]);

describe('Unverified Alert component', () => {
  it('renders without service description', () => {
    const { getByRole } = render(
      <Provider store={mockStore()}>
        <UnverifiedAlert />
      </Provider>,
    );
    expect(getByRole('heading', { name: headingPrefix })).to.exist;
  });

  it('with service description', () => {
    const serviceDescription = 'order supplies';

    const { getByRole } = render(
      <Provider store={mockStore()}>
        <UnverifiedAlert serviceDescription={serviceDescription} />
      </Provider>,
    );
    const expectedHeadline = `${headingPrefix} to ${serviceDescription}`;
    expect(getByRole('heading', { name: expectedHeadline })).to.exist;
  });

  it('renders MHV account alert', () => {
    const { getByText } = render(
      <Provider store={mockStore()}>
        <UnverifiedAlert signInService={CSP_IDS.MHV} />
      </Provider>,
    );
    expect(getByText(/You have 2 options/)).to.exist;
  });

  it('renders alert for non-MHV accounts', () => {
    const { getByRole } = render(
      <Provider store={mockStore()}>
        <UnverifiedAlert signInService={CSP_IDS.ID_ME} />
      </Provider>,
    );
    expect(getByRole('link', { name: /Verify your identity with/ })).to.exist;
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
