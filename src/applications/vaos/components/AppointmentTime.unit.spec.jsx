import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import AppointmentTime from './AppointmentTime';

describe('AppointmentTime', () => {
  const sampleDate = '2024-11-18T18:30:00Z';
  const timezone = 'America/New_York';

  it('should render time with timezone conversion', () => {
    const { getByTestId } = render(
      <AppointmentTime date={sampleDate} timezone={timezone} />,
    );

    const timeElement = getByTestId('appointment-time');
    expect(timeElement).to.exist;

    // Should show either 1:30 PM or 2:30 PM depending on DST
    const timeText = timeElement.textContent;
    const hasCorrectTime =
      timeText.includes('1:30') || timeText.includes('2:30');
    expect(hasCorrectTime).to.be.true;

    // Should include p.m.
    const hasPM = timeText.includes('p.m.');
    expect(hasPM).to.be.true;
  });

  it('should strip DST from timezone', () => {
    const { getByTestId } = render(
      <AppointmentTime date={sampleDate} timezone={timezone} />,
    );

    const timeElement = getByTestId('appointment-time');
    const timeText = timeElement.textContent;

    // Should include ET (stripped DST) rather than EST/EDT
    expect(timeText).to.include('ET');
  });

  it('should have data-dd-privacy mask attribute', () => {
    const { getByTestId } = render(
      <AppointmentTime date={sampleDate} timezone={timezone} />,
    );

    const timeElement = getByTestId('appointment-time');
    expect(timeElement).to.exist;
    expect(timeElement.getAttribute('data-dd-privacy')).to.equal('mask');
  });

  it('should handle different timezones correctly', () => {
    const pacificTimezone = 'America/Los_Angeles';
    const { getByTestId } = render(
      <AppointmentTime date={sampleDate} timezone={pacificTimezone} />,
    );

    const timeElement = getByTestId('appointment-time');
    const timeText = timeElement.textContent;

    // Should show either 10:30 AM or 11:30 AM for Pacific time
    const hasCorrectTime =
      timeText.includes('10:30') || timeText.includes('11:30');
    expect(hasCorrectTime).to.be.true;

    // Should include a.m.
    const hasAM = timeText.includes('a.m.');
    expect(hasAM).to.be.true;
  });

  it('should render separate timezone abbreviation element', () => {
    const { getByTestId } = render(
      <AppointmentTime date={sampleDate} timezone={timezone} />,
    );

    const timezoneElement = getByTestId('appointment-time-abbreviation');
    expect(timezoneElement).to.exist;
    expect(timezoneElement.getAttribute('aria-hidden')).to.equal('true');
    expect(timezoneElement.textContent).to.include('ET');
  });

  it('should render screen reader description', () => {
    const { getByTestId } = render(
      <AppointmentTime date={sampleDate} timezone={timezone} />,
    );

    const descriptionElement = getByTestId('appointment-time-description');
    expect(descriptionElement).to.exist;
    expect(descriptionElement.className).to.include('sr-only');

    const descriptionText = descriptionElement.textContent;
    expect(descriptionText).to.include('p.m.');
    expect(descriptionText).to.include('ET');
    expect(descriptionText).to.include('Appointment time in Eastern');
  });

  it('should have proper accessibility structure', () => {
    const { getByTestId } = render(
      <AppointmentTime date={sampleDate} timezone={timezone} />,
    );

    const mainElement = getByTestId('appointment-time');
    const timezoneElement = getByTestId('appointment-time-abbreviation');
    const descriptionElement = getByTestId('appointment-time-description');

    // Main element should have data-dd-privacy
    expect(mainElement.getAttribute('data-dd-privacy')).to.equal('mask');

    // Timezone should be aria-hidden
    expect(timezoneElement.getAttribute('aria-hidden')).to.equal('true');

    // Description should be screen reader only
    expect(descriptionElement.className).to.include('sr-only');
  });

  it('should format Pacific timezone correctly with abbreviation', () => {
    const pacificTimezone = 'America/Los_Angeles';
    const { getByTestId } = render(
      <AppointmentTime date={sampleDate} timezone={pacificTimezone} />,
    );

    const timezoneElement = getByTestId('appointment-time-abbreviation');
    expect(timezoneElement.textContent).to.include('PT');

    const descriptionElement = getByTestId('appointment-time-description');
    const descriptionText = descriptionElement.textContent;
    expect(descriptionText).to.include('PT');
    expect(descriptionText).to.include('Appointment time in Pacific');
  });
});
