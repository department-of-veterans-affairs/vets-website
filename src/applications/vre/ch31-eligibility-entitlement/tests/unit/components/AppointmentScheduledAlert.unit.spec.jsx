import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import AppointmentScheduledAlert from '../../../components/AppointmentScheduledAlert';

describe('AppointmentScheduledAlert', () => {
  it('renders the expandable alert with expected attributes and content', () => {
    const { container, getByText } = render(<AppointmentScheduledAlert />);

    const wrapper = container.querySelector('div.vads-u-margin-y--3');
    expect(wrapper).to.exist;

    const alert = container.querySelector('va-alert-expandable');
    expect(alert).to.exist;
    expect(alert.getAttribute('status')).to.equal('info');
    expect(alert.getAttribute('trigger')).to.equal(
      'You have an Appointment Scheduled',
    );

    getByText(/We would like to remind you/i);
    getByText(/appointment scheduled with your Counselor/i);

    getByText(/11\/30\/2025/i);
    getByText(/2:00 pm ET/i);

    const address = container.querySelector('.va-address-block');
    expect(address).to.exist;

    expect(address.textContent).to.match(
      /U\.S\.\s*Department\s+of\s+Veterans\s+Affairs/i,
    );
    expect(address.textContent).to.match(/Medical\s+Office/i);
    expect(address.textContent).to.match(/PO\s+Box\s+11930/i);
    expect(address.textContent).to.match(/St\.\s*Paul,\s*MN\s*55111/i);
    expect(address.textContent).to.match(/United\s+States\s+of\s+America/i);
  });
});
