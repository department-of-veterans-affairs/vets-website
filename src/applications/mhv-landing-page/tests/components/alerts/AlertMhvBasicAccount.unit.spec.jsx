import React from 'react';
import { Provider } from 'react-redux';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import AlertMhvBasicAccount from '../../../components/alerts/AlertMhvBasicAccount';

const { defaultProps } = AlertMhvBasicAccount;

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

describe('<AlertMhvBasicAccount />', () => {
  it('renders', async () => {
    const store = generateStore();
    const recordEvent = sinon.spy();
    const props = { ...defaultProps, recordEvent };
    const { getByRole, getByTestId } = render(
      <Provider store={store}>
        <AlertMhvBasicAccount {...props} />,
      </Provider>,
    );
    getByTestId(defaultProps.testId);

    getByRole('heading', { name: defaultProps.headline });
    await waitFor(() => {
      expect(recordEvent.calledOnce).to.be.true;
      expect(recordEvent.calledTwice).to.be.false;
    });
  });
});
