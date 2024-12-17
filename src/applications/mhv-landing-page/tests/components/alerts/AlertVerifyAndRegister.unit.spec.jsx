import React from 'react';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import AlertVerifyAndRegister from '../../../components/alerts/AlertVerifyAndRegister';

const { defaultProps } = AlertVerifyAndRegister;

const generateStore = ({
  csp = 'logingov',
  verified = false,
  loading = false,
} = {}) => ({
  getState: () => ({
    user: {
      profile: {
        loading,
        signIn: { serviceName: csp },
        verified,
        session: { authBroker: 'iam' },
      },
    },
  }),
  dispatch: () => {},
  subscribe: () => {},
});

describe('<AlertVerifyAndRegister />', () => {
  it('renders', async () => {
    const store = generateStore();
    const recordEvent = sinon.spy();
    const props = { recordEvent };
    const { getByTestId } = render(
      <Provider store={store}>
        <AlertVerifyAndRegister {...props} />
      </Provider>,
    );
    getByTestId(defaultProps.testId);
    await waitFor(() => {
      expect(recordEvent.calledOnce).to.be.true;
      expect(recordEvent.calledTwice).to.be.false;
    });
  });
});
