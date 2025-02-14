import React from 'react';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import AlertVerifyAndRegister from '../../../components/alerts/AlertVerifyAndRegister';

const { defaultProps } = AlertVerifyAndRegister;

const createMockStore = serviceName => ({
  getState: () => ({
    user: { profile: { signIn: { serviceName } } },
  }),
  dispatch: () => {},
  subscribe: () => {},
});

describe('<AlertVerifyAndRegister />', () => {
  it('renders alert for Login.gov account', async () => {
    const recordEvent = sinon.spy();
    const props = { recordEvent };
    const { container, getByTestId } = render(
      <Provider store={createMockStore('logingov')}>
        <AlertVerifyAndRegister {...props} />
      </Provider>,
    );
    expect(getByTestId(defaultProps.testId)).to.exist;
    expect(container.querySelector('.logingov-verify-button')).to.exist;
    expect(container.querySelector('.idme-verify-button')).to.not.exist;
    await waitFor(() => {
      expect(recordEvent.calledOnce).to.be.true;
      expect(recordEvent.calledTwice).to.be.false;
    });
  });
  it('renders alert for ID.me account', async () => {
    const recordEvent = sinon.spy();
    const props = { recordEvent, cspId: 'idme' };
    const { getByTestId, container } = render(
      <Provider store={createMockStore('idme')}>
        <AlertVerifyAndRegister {...props} />
      </Provider>,
    );
    expect(getByTestId(defaultProps.testId)).to.exist;
    expect(container.querySelector('.logingov-verify-button')).to.not.exist;
    expect(container.querySelector('.idme-verify-button')).to.exist;
    await waitFor(() => {
      expect(recordEvent.calledOnce).to.be.true;
      expect(recordEvent.calledTwice).to.be.false;
    });
  });
});
