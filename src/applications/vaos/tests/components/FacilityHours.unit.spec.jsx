import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';

import FacilityHours from '../../components/FacilityHours';

const hoursOfOperation = [
  {
    daysOfWeek: ['mon'],
    allDay: false,
    openingTime: '08:00',
    closingTime: '16:00',
  },
  {
    daysOfWeek: ['wed', 'thu', 'fri', 'sat', 'sun'],
    allDay: true,
    openingTime: null,
    closingTime: null,
  },
];

describe('VAOS <FacilityHours>', () => {
  it('should render', () => {
    const screen = render(
      <FacilityHours hoursOfOperation={hoursOfOperation} />,
    );

    expect(screen.getByText('Sunday')).to.be.ok;
    expect(screen.getByText('Monday')).to.be.ok;
    expect(screen.getByText('Tuesday')).to.be.ok;
    expect(screen.getByText('Wednesday')).to.be.ok;
    expect(screen.getByText('Thursday')).to.be.ok;
    expect(screen.getByText('Friday')).to.be.ok;
    expect(screen.getByText('Saturday')).to.be.ok;

    // Facility should be open on Monday
    expect(screen.getByText('8:00 a.m. - 4:00 p.m.')).to.be.ok;

    // Facility should be closed on Tuesday
    expect(screen.getByText('Closed')).to.be.ok;

    // Facility should be open all day on Wed, Thu, Fri, Sat, & Sun
    expect(screen.getAllByText('24/7').length).to.equal(5);
  });
});
