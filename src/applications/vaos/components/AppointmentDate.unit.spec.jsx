import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import AppointmentDate from './AppointmentDate';

describe('AppointmentDate', () => {
  const sampleDate = '2024-11-18T18:30:00Z';
  const sampleTimezone = 'America/New_York';

  it('should render date with default format', () => {
    const { getByTestId } = render(
      <AppointmentDate date={sampleDate} timezone={sampleTimezone} />,
    );

    const dateElement = getByTestId('appointment-date');
    expect(dateElement).to.exist;
    expect(dateElement.textContent).to.include('Monday, November 18th, 2024');
  });

  it('should have data-dd-privacy mask attribute', () => {
    const { getByTestId } = render(
      <AppointmentDate date={sampleDate} timezone={sampleTimezone} />,
    );

    const dateElement = getByTestId('appointment-date');
    expect(dateElement).to.exist;
    expect(dateElement.getAttribute('data-dd-privacy')).to.equal('mask');
  });
});
