import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import AppointmentScheduledAlert from '../../../components/AppointmentScheduledAlert';

describe('AppointmentScheduledAlert', () => {
  it('renders the expandable alert and shows formatted date + address', () => {
    const { container } = render(
      <AppointmentScheduledAlert
        appointmentDateTime="2026-06-15T18:00:00.000Z"
        appointmentPlace="31223 Corn Drive, Hamilton NJ-21223"
      />,
    );

    const alert = container.querySelector('va-alert-expandable');
    expect(alert).to.exist;
    expect(alert.getAttribute('status')).to.equal('info');
    expect(alert.getAttribute('trigger')).to.equal(
      'You have an appointment scheduled',
    );
    expect(container.querySelector('strong').textContent).to.include(
      '06/15/2026',
    );
    expect(container.querySelector('.va-address-block')).to.exist;
  });

  it('renders fallback copy and no address when props are missing', () => {
    const { container } = render(<AppointmentScheduledAlert />);

    expect(container.querySelector('va-alert-expandable')).to.exist;
    expect(container.querySelector('strong')).to.not.exist;
    expect(container.querySelector('.va-address-block')).to.not.exist;
  });
});
