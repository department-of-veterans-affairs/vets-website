import React from 'react';
import createMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import UnauthenticatedAlert, {
  headingPrefix,
} from '../../../components/messages/UnauthenticatedAlert';

const mockStore = createMockStore([]);

describe('Unauthenticated Alert component', () => {
  it('renders without service description', async () => {
    const { getByRole } = render(
      <Provider store={mockStore()}>
        <UnauthenticatedAlert />
      </Provider>,
    );
    expect(getByRole('heading', { name: headingPrefix })).to.exist;
  });

  it('with service description', async () => {
    const serviceDescription = 'order supplies';

    const { getByRole } = render(
      <Provider store={mockStore()}>
        <UnauthenticatedAlert serviceDescription={serviceDescription} />
      </Provider>,
    );
    const expectedHeadline = `${headingPrefix} to ${serviceDescription}`;
    expect(getByRole('heading', { name: expectedHeadline })).to.exist;
  });

  it('reports analytics', async () => {
    const recordEventSpy = sinon.spy();
    render(
      <Provider store={mockStore()}>
        <UnauthenticatedAlert recordEvent={recordEventSpy} />
      </Provider>,
    );
    await waitFor(() => {
      expect(recordEventSpy.calledOnce).to.be.true;
    });
  });
});
