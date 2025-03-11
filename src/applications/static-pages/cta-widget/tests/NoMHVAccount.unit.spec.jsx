import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import NoMHVAccount from '../components/messages/NoMHVAccount';

describe('<NoMHVAccount/>', () => {
  it('reports to GA via recordEvent on render', async () => {
    const event = {
      event: 'nav-alert-box-load',
      action: 'load',
      'alert-box-headline': 'Please create a My HealtheVet account to TEST',
      'alert-box-status': 'warning',
    };
    const recordEvent = sinon.spy();
    render(
      <NoMHVAccount
        serviceDescription="TEST"
        primaryButtonHandler={() => {}}
        secondaryButtonHandler={() => {}}
        recordEventFn={recordEvent}
      />,
    );
    await waitFor(() => {
      expect(recordEvent.calledOnce).to.be.true;
      expect(recordEvent.calledWith(event)).to.be.true;
      expect(recordEvent.calledTwice).to.be.false;
    });
  });
});
