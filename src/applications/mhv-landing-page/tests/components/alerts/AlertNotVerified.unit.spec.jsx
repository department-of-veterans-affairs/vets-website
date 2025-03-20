import React from 'react';
import { waitFor } from '@testing-library/react';
import { renderInReduxProvider } from 'platform/testing/unit/react-testing-library-helpers';
import sinon from 'sinon';
import { expect } from 'chai';

import AlertNotVerified from '../../../components/alerts/AlertNotVerified';

describe('<AlertNotVerified />', () => {
  it('renders', async () => {
    const recordEvent = sinon.spy();
    const props = { recordEvent };
    const { getByTestId, container } = renderInReduxProvider(
      <AlertNotVerified {...props} />,
      {
        initialState: {
          user: { profile: { signIn: { serviceName: 'idme' } } },
        },
      },
    );
    getByTestId('verify-identity-alert-headline');
    expect(container.querySelector('va-alert-sign-in')).to.exist;
    await waitFor(() => {
      expect(recordEvent.calledOnce).to.be.true;
      expect(recordEvent.calledTwice).to.be.false;
    });
  });
});
