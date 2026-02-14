import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import AppointmentScheduledAlert from '../../../components/AppointmentScheduledAlert';

describe('AppointmentScheduledAlert', () => {
  it('renders the expandable alert and shows formatted date + address when props are provided', () => {
    const appointmentDateTime = '2026-06-15T18:00:00.000Z';
    const appointmentPlace = '31223 Corn Drive, Hamilton NJ-21223';

    const { container, getByText } = render(
      <AppointmentScheduledAlert
        appointmentDateTime={appointmentDateTime}
        appointmentPlace={appointmentPlace}
      />,
    );

    const wrapper = container.querySelector('div.vads-u-margin-y--3');
    expect(wrapper).to.exist;

    const alert = container.querySelector('va-alert-expandable');
    expect(alert).to.exist;
    expect(alert.getAttribute('status')).to.equal('info');
    expect(alert.getAttribute('trigger')).to.equal(
      'You have an appointment scheduled',
    );

    getByText(/We would like to remind you/i);
    getByText(/appointment scheduled with your counselor for/i);

    const strong = container.querySelector('strong');
    expect(strong).to.exist;
    expect(strong.textContent).to.include('06/15/2026');

    const address = container.querySelector('.va-address-block');
    expect(address).to.exist;
    expect(address.textContent).to.match(/31223\s+Corn\s+Drive/i);
    expect(address.textContent).to.match(/Hamilton\s+NJ-21223/i);
  });

  it('renders fallback copy and no address when props are missing', () => {
    const { container, getByText } = render(<AppointmentScheduledAlert />);

    const alert = container.querySelector('va-alert-expandable');
    expect(alert).to.exist;

    getByText(/We would like to remind you/i);
    getByText(/appointment scheduled with your counselor\./i);

    const strong = container.querySelector('strong');
    expect(strong).to.not.exist;

    const address = container.querySelector('.va-address-block');
    expect(address).to.not.exist;
  });
});
