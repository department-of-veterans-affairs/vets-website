import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import userEvent from '@testing-library/user-event';

import PaymentHistory from '../../../components/direct-deposit/PaymentHistory';

import { renderWithProfileReducers } from '../../unit-test-helpers';

describe('PaymentHistory', () => {
  it('should render the payment history link', async () => {
    const tree = renderWithProfileReducers(<PaymentHistory />, {
      initialState: {
        featureToggles: {
          loading: false,
        },
      },
    });

    const link = await tree.findByRole('link', {
      name: /view your payment history/i,
    });
    expect(link).to.exist;
  });

  it('should record an event when the payment history link is clicked', () => {
    const recordEventSpy = sinon.spy();

    const tree = renderWithProfileReducers(
      <PaymentHistory recordEvent={recordEventSpy} />,
      {
        initialState: {
          featureToggles: {
            loading: false,
          },
        },
      },
    );

    const link = tree.getByRole('link', {
      name: /view your payment history/i,
    });
    userEvent.click(link);

    expect(recordEventSpy.firstCall.args[0]).to.be.deep.equal({
      event: 'profile-navigation',
      'profile-action': 'view-link',
      'profile-section': 'view-payment-history',
    });
  });
});
