import React from 'react';
import { render, waitFor } from '@testing-library/react';
import sinon from 'sinon';
import { expect } from 'chai';

import { CSP_IDS } from '~/platform/user/authentication/constants';

import AlertNotVerified from '../../../components/alerts/AlertNotVerified';

describe('<AlertNotVerified />', () => {
  it('renders', async () => {
    const recordEvent = sinon.spy();
    const props = { signInService: CSP_IDS.ID_ME, recordEvent };
    const { getByTestId } = render(<AlertNotVerified {...props} />);
    getByTestId('verify-identity-alert-headline');
    await waitFor(() => {
      expect(recordEvent.calledOnce).to.be.true;
    });
  });
});
