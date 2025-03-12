import React from 'react';
import createMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { CSP_IDS } from '~/platform/user/authentication/constants';
import UnverifiedAlert, {
  headingPrefix,
  mhvHeadingPrefix,
} from '../../../components/messages/UnverifiedAlert';

const mockStore = createMockStore([]);

describe('Unverified Alert component', () => {
  it('renders without service description', () => {
    const { getByRole } = render(
      <Provider store={mockStore()}>
        <UnverifiedAlert />
      </Provider>,
    );
    expect(getByRole('heading', { level: 3, name: headingPrefix })).to.exist;
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

  it('with header level 4', () => {
    const { getByRole } = render(
      <Provider store={mockStore()}>
        <UnverifiedAlert headerLevel={4} />
      </Provider>,
    );
    expect(getByRole('heading', { level: 4, name: headingPrefix })).to.exist;
  });

  it('renders MHV account alert', () => {
    const { getByRole, getByText } = render(
      <Provider store={mockStore()}>
        <UnverifiedAlert signInService={CSP_IDS.MHV} />
      </Provider>,
    );
    expect(getByRole('heading', { level: 3, name: mhvHeadingPrefix })).to.exist;
    expect(getByText(/You have 2 options/)).to.exist;
  });

  it('renders alert for Login.gov account', () => {
    const { getByRole, queryByRole } = render(
      <Provider store={mockStore()}>
        <UnverifiedAlert signInService={CSP_IDS.LOGIN_GOV} />
      </Provider>,
    );
    expect(getByRole('button', { name: /Verify with Login.gov/ })).to.exist;
    expect(queryByRole('button', { name: /Verify with ID.me/ })).not.to.exist;
  });

  it('renders alert for ID.me account', () => {
    const { getByRole, queryByRole } = render(
      <Provider store={mockStore()}>
        <UnverifiedAlert signInService={CSP_IDS.ID_ME} />
      </Provider>,
    );
    expect(getByRole('button', { name: /Verify with ID.me/ })).to.exist;
    expect(queryByRole('button', { name: /Verify with Login.gov/ })).not.to
      .exist;
  });

  it('renders alert for MHV Basic account', () => {
    const { getByRole } = render(
      <Provider store={mockStore()}>
        <UnverifiedAlert signInService={CSP_IDS.MHV} />
      </Provider>,
    );
    expect(getByRole('button', { name: /Verify with ID.me/ })).to.exist;
    expect(getByRole('button', { name: /Verify with Login.gov/ })).to.exist;
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
