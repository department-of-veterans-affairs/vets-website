import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import MhvRegistrationAlert from '../../components/MhvRegistrationAlert';

const defaultHeadline = MhvRegistrationAlert.defaultProps.headline;

describe('MhvRegistrationAlert', () => {
  it('renders', () => {
    const { getByRole } = render(<MhvRegistrationAlert />);
    getByRole('heading', { name: defaultHeadline });
    const link = getByRole('link', { name: /Register with My HealtheVet/ });
    expect(link.href).to.not.be.empty;
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
    render(<MhvRegistrationAlert {...props} />);
    await waitFor(() => {
      expect(recordEventSpy.calledOnce).to.be.true;
      expect(recordEventSpy.calledWith(event)).to.be.true;
    });
  });
});
