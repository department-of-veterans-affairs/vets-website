import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import AppointmentScheduledAlert, {
  formatApptDateTime,
} from '../../../components/AppointmentScheduledAlert';

describe('AppointmentScheduledAlert', () => {
  it('renders the expandable alert and shows formatted date + address', () => {
    const { container, getByText } = render(
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

    // Check formatted date in text
    const formattedDate = formatApptDateTime('2026-06-15T18:00:00.000Z');
    expect(getByText(new RegExp(formattedDate))).to.exist;

    // Address block
    expect(container.querySelector('.va-address-block')).to.exist;
    expect(getByText(/31223 Corn Drive/)).to.exist;
    expect(getByText(/Hamilton NJ-21223/)).to.exist;
  });

  it('renders nothing when appointmentDateTime is missing', () => {
    const { container } = render(<AppointmentScheduledAlert />);
    // Should not render anything if appointmentDateTime is missing
    expect(container.firstChild).to.be.null;
  });

  it('renders Teams fallback when appointmentDateTime exists but not appointmentPlace', () => {
    const { container, getByText } = render(
      <AppointmentScheduledAlert appointmentDateTime="2026-06-15T18:00:00.000Z" />,
    );

    // va-alert-expandable is a shadow DOM component
    const alert = container.querySelector('va-alert-expandable');
    expect(alert).to.exist;
    expect(alert.getAttribute('status')).to.equal('info');
    expect(alert.getAttribute('trigger')).to.equal(
      'You have an appointment scheduled',
    );

    // Should render Teams fallback text
    const formattedDate = formatApptDateTime('2026-06-15T18:00:00.000Z');
    expect(
      getByText(
        new RegExp(
          `You have an appointment scheduled for ${formattedDate} via Microsoft Teams.`,
        ),
      ),
    ).to.exist;
    expect(
      getByText(
        /The Microsoft Teams meeting link will be included in the appointment confirmation email sent to you\./,
      ),
    ).to.exist;

    // Should NOT render address block
    expect(container.querySelector('.va-address-block')).to.be.null;
  });

  it('formats date as mm/dd/yyyy at hh:mm am|pm ET', () => {
    // 2026-06-15T18:00:00.000Z is 1:00 PM CT (CDT)
    const formatted = formatApptDateTime('2026-06-15T18:00:00.000Z');
    expect(formatted).to.match(/06\/15\/2026 at 1:00 PM CT/);

    // 2026-01-15T13:30:00.000Z is 7:30 AM CT (CST)
    const formatted2 = formatApptDateTime('2026-01-15T13:30:00.000Z');
    expect(formatted2).to.match(/01\/15\/2026 at 7:30 AM CT/);
  });

  it('returns empty string for invalid date', () => {
    expect(formatApptDateTime('')).to.equal(null);
    expect(formatApptDateTime(null)).to.equal(null);
    expect(formatApptDateTime(undefined)).to.equal(null);
  });
});
