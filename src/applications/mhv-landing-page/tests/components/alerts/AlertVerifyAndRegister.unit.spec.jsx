import React from 'react';
import createMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import AlertVerifyAndRegister from '../../../components/alerts/AlertVerifyAndRegister';

const { defaultProps } = AlertVerifyAndRegister;

const mockStore = createMockStore([]);

describe('<AlertVerifyAndRegister />', () => {
  it('renders alert for Login.gov account', async () => {
    const recordEvent = sinon.spy();
    const props = { recordEvent };
    const { getByRole, getByTestId, queryByRole } = render(
      <Provider store={mockStore()}>
        <AlertVerifyAndRegister {...props} />
      </Provider>,
    );
    getByTestId(defaultProps.testId);
    expect(getByRole('button', { name: /Verify with Login.gov/ })).to.exist;
    expect(queryByRole('button', { name: /Verify with ID.me/ })).not.to.exist;
    await waitFor(() => {
      expect(recordEvent.calledOnce).to.be.true;
      expect(recordEvent.calledTwice).to.be.false;
    });
  });
  it('renders alert for ID.me account', async () => {
    const recordEvent = sinon.spy();
    const props = { recordEvent, cspId: 'idme' };
    const { getByRole, getByTestId, queryByRole } = render(
      <Provider store={mockStore()}>
        <AlertVerifyAndRegister {...props} />
      </Provider>,
    );
    getByTestId(defaultProps.testId);
    expect(getByRole('button', { name: /Verify with ID.me/ })).to.exist;
    expect(queryByRole('button', { name: /Verify with Login.gov/ })).not.to
      .exist;
    await waitFor(() => {
      expect(recordEvent.calledOnce).to.be.true;
      expect(recordEvent.calledTwice).to.be.false;
    });
  });
});
