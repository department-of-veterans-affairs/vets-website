import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import { logoutUrl } from '@department-of-veterans-affairs/platform-user/authentication/utilities';
import { logoutUrlSiS } from '~/platform/utilities/oauth/utilities';

import AlertMhvBasicAccount from '../../../components/alerts/AlertMhvBasicAccount';

const { defaultProps } = AlertMhvBasicAccount;

describe('<AlertMhvBasicAccount />', () => {
  it('renders', async () => {
    const recordEvent = sinon.spy();
    const props = { ...defaultProps, recordEvent };
    const { getByRole, getByTestId } = render(
      <AlertMhvBasicAccount {...props} />,
    );
    getByTestId(defaultProps.testId);
    getByRole('heading', { name: defaultProps.headline });
    await waitFor(() => {
      expect(recordEvent.calledOnce).to.be.true;
      expect(recordEvent.calledTwice).to.be.false;
    });
  });

  describe('Sign out button', () => {
    it('redirects to logoutUrlSis() when ssoe is false', async () => {
      const props = { ...defaultProps, ssoe: false };
      const { getByTestId } = render(<AlertMhvBasicAccount {...props} />);
      // getByRole('button', { label: 'Sign out' }).click();
      getByTestId('mhv-button--sign-out').click();
      await waitFor(() => {
        expect(window.location).to.equal(logoutUrlSiS());
      });
    });

    it('redirects to logoutUrl() when ssoe is true', async () => {
      const props = { ...defaultProps, ssoe: true };
      const { getByTestId } = render(<AlertMhvBasicAccount {...props} />);
      // getByRole('button', { label: 'Sign out' }).click();
      getByTestId('mhv-button--sign-out').click();
      await waitFor(() => {
        expect(window.location).to.equal(logoutUrl());
      });
    });
  });
});
