import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';

import { mhvUrl } from '~/platform/site-wide/mhv/utilities.js';
import MhvRegistrationAlert from '../../components/MhvRegistrationAlert';

const defaultHeadline = MhvRegistrationAlert.defaultProps.headline;

describe('MhvRegistrationAlert', () => {
  const mockStore = ({ ssoe = true } = {}) => ({
    getState: () => ({
      user: {
        profile: {
          session: {
            ssoe,
          },
        },
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  });

  it('renders', () => {
    const { getByRole } = render(
      <Provider store={mockStore({ ssoe: true })}>
        <MhvRegistrationAlert />
      </Provider>,
    );
    getByRole('heading', { name: defaultHeadline });
  });

  it('reports to GA via recordEvent when rendered', async () => {
    const event = {
      event: 'nav-alert-box-load',
      action: 'load',
      'alert-box-headline': defaultHeadline,
      'alert-box-status': MhvRegistrationAlert.defaultProps.status,
    };
    const recordEventSpy = sinon.spy();
    const props = { recordEvent: recordEventSpy };
    render(
      <Provider store={mockStore({ ssoe: true })}>
        <MhvRegistrationAlert {...props} />
      </Provider>,
    );
    await waitFor(() => {
      expect(recordEventSpy.calledOnce).to.be.true;
      expect(recordEventSpy.calledWith(event)).to.be.true;
    });
  });

  describe('MHV registration URL', () => {
    const linkText = /Register with My HealtheVet/;
    const linkPath = 'home';

    it('registration URL for SSOe users', () => {
      const { getByRole } = render(
        <Provider store={mockStore({ ssoe: true })}>
          <MhvRegistrationAlert />
        </Provider>,
      );
      const link = getByRole('link', { name: linkText });
      expect(link).to.exist;
      expect(link.href).to.eql(mhvUrl(true, linkPath));
    });

    it('registration URL for non-SSOe users', () => {
      const { getByRole } = render(
        <Provider store={mockStore({ ssoe: false })}>
          <MhvRegistrationAlert />
        </Provider>,
      );
      const link = getByRole('link', { name: linkText });
      expect(link).to.exist;
      expect(link.href).to.eql(mhvUrl(false, linkPath));
    });
  });
});
