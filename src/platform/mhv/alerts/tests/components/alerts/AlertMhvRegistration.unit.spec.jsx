import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import AlertMhvRegistration from '../../../components/alerts/AlertMhvRegistration';

const { defaultProps } = AlertMhvRegistration;

describe('<AlertMhvRegistration />', () => {
  it('renders', () => {
    const { getByRole, getByTestId } = render(<AlertMhvRegistration />);
    getByTestId(defaultProps.testId);
    getByRole('heading', { name: defaultProps.headline });
    getByRole('link', { name: /Register with My HealtheVet/ });
  });

  it('reports to GA via recordEvent on render', async () => {
    const event = {
      event: 'nav-alert-box-load',
      action: 'load',
      'alert-box-headline': defaultProps.headline,
      'alert-box-status': 'warning',
    };
    const recordEvent = sinon.spy();
    const props = { recordEvent };
    render(<AlertMhvRegistration {...props} />);
    await waitFor(() => {
      expect(recordEvent.calledOnce).to.be.true;
      expect(recordEvent.calledWith(event)).to.be.true;
      expect(recordEvent.calledTwice).to.be.false;
    });
  });
});
