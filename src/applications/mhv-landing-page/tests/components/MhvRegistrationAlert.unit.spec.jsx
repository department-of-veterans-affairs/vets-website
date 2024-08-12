import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import { Provider } from 'react-redux';

import MhvRegistrationAlert from '../../components/MhvRegistrationAlert';

const defaultHeadline = MhvRegistrationAlert.defaultProps.headline;

describe('MhvRegistrationAlert', () => {
  const mockStore = () => ({
    getState: () => ({
      user: {
        profile: {
          session: {
            ssoe: true,
          },
        },
      },
    }),
    subscribe: () => {},
    dispatch: () => {},
  });

  it('renders', () => {
    const { getByRole } = render(
      <Provider store={mockStore()}>
        <MhvRegistrationAlert />
      </Provider>,
    );
    getByRole('heading', { name: defaultHeadline });
    getByRole('link', { name: /Register with My HealtheVet/ });
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
      <Provider store={mockStore()}>
        <MhvRegistrationAlert {...props} />
      </Provider>,
    );
    await waitFor(() => {
      expect(recordEventSpy.calledOnce).to.be.true;
      expect(recordEventSpy.calledWith(event)).to.be.true;
    });
  });
});
