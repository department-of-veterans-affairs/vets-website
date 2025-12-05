import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import AppointmentDateTime from './AppointmentDateTime';

describe('AppointmentDateTime', () => {
  const defaultProps = {
    start: '2024-11-15T10:00:00Z',
    timezone: 'America/New_York',
  };
  const mockCalendarData = {
    vaos: {
      isCommunityCare: true,
    },
    start: new Date('2024-11-15T10:00:00Z'),
    minutesDuration: 30,
    title: 'Medical Appointment',
    communityCareProvider: {
      name: 'Community Medical Center',
      address: '123 Main St, Springfield, MA 01101',
      phone: '555-123-4567',
      website: 'https://www.communitymedicalcenter.com',
      timezone: 'America/New_York',
      practiceName: 'Community Medical Center',
    },
  };

  it('should render AppointmentDate component with correct props', () => {
    const { container } = render(<AppointmentDateTime {...defaultProps} />);

    // AppointmentDate component should be rendered
    expect(container.querySelector('[data-testid="appointment-date"]')).to
      .exist;
  });

  it('should render AppointmentTime component with correct props', () => {
    const { container } = render(<AppointmentDateTime {...defaultProps} />);

    // AppointmentTime component should be rendered
    expect(container.querySelector('[data-testid="appointment-time"]')).to
      .exist;
  });

  it('should render both date and time components', () => {
    const { container } = render(<AppointmentDateTime {...defaultProps} />);

    expect(container.querySelector('[data-testid="appointment-date"]')).to
      .exist;
    expect(container.querySelector('[data-testid="appointment-time"]')).to
      .exist;
  });

  it('should not render AddToCalendarButton when calendarButton is false', () => {
    const { container } = render(
      <AppointmentDateTime {...defaultProps} calendarButton={false} />,
    );

    expect(container.querySelector('[data-testid="add-to-calendar-button"]')).to
      .not.exist;
  });

  it('should not render AddToCalendarButton by default when calendarButton prop is not provided', () => {
    const { container } = render(<AppointmentDateTime {...defaultProps} />);

    expect(container.querySelector('[data-testid="add-to-calendar-button"]')).to
      .not.exist;
  });

  it('should render AddToCalendarButton when calendarButton is true', () => {
    const { container } = render(
      <AppointmentDateTime
        {...defaultProps}
        showAddToCalendarButton
        calendarData={mockCalendarData}
      />,
    );

    expect(container.querySelector('[data-testid="add-to-calendar-button"]')).to
      .exist;
  });

  it('should pass calendarData to AddToCalendarButton when provided', () => {
    const { container } = render(
      <AppointmentDateTime
        {...defaultProps}
        showAddToCalendarButton
        calendarData={mockCalendarData}
      />,
    );

    expect(container.querySelector('[data-testid="add-to-calendar-button"]')).to
      .exist;
  });

  it('should handle different timezones correctly', () => {
    const { container } = render(
      <AppointmentDateTime
        start="2024-11-15T10:00:00Z"
        timezone="America/Los_Angeles"
      />,
    );

    expect(container.querySelector('[data-testid="appointment-date"]')).to
      .exist;
    expect(container.querySelector('[data-testid="appointment-time"]')).to
      .exist;
  });

  it('should handle Eastern timezone correctly', () => {
    const { container } = render(
      <AppointmentDateTime
        start="2024-11-15T10:00:00Z"
        timezone="America/New_York"
      />,
    );

    expect(container.querySelector('[data-testid="appointment-date"]')).to
      .exist;
    expect(container.querySelector('[data-testid="appointment-time"]')).to
      .exist;
  });

  it('should handle Central timezone correctly', () => {
    const { container } = render(
      <AppointmentDateTime
        start="2024-11-15T10:00:00Z"
        timezone="America/Chicago"
      />,
    );

    expect(container.querySelector('[data-testid="appointment-date"]')).to
      .exist;
    expect(container.querySelector('[data-testid="appointment-time"]')).to
      .exist;
  });

  it('should handle Mountain timezone correctly', () => {
    const { container } = render(
      <AppointmentDateTime
        start="2024-11-15T10:00:00Z"
        timezone="America/Denver"
      />,
    );

    expect(container.querySelector('[data-testid="appointment-date"]')).to
      .exist;
    expect(container.querySelector('[data-testid="appointment-time"]')).to
      .exist;
  });

  it('should render a line break between date and time', () => {
    const { container } = render(<AppointmentDateTime {...defaultProps} />);

    const brs = container.querySelectorAll('br');
    expect(brs.length).to.be.at.least(1);
  });
});
