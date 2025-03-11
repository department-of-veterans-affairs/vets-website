import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import LocationHours from '../../components/LocationHours';

describe('<LocationHours>', () => {
  const makeTestFacility = (facilityType, hours) => ({
    id: 'vha_549',
    type: 'facility',
    attributes: {
      facilityType,
      activeStatus: 'A',
      mobile: false,
      name: 'Dallas VA Medical Center',
      operatingStatus: {
        code: 'NORMAL',
      },
      hours,
      uniqueId: '549',
      visn: '17',
      website: 'https://www.northtexas.va.gov/locations/directions.asp',
    },
  });

  it('should render LocationHours with the correct values given', () => {
    const hours = {
      monday: '24/7',
      tuesday: '24/7',
      wednesday: '24/7',
      thursday: '24/7',
      friday: '24/7',
      saturday: '24/7',
      sunday: '24/7',
    };

    const screen = render(
      <LocationHours
        location={makeTestFacility('va_health_facility', hours)}
      />,
    );

    expect(screen.queryByText('Sunday:')).to.exist;
    expect(screen.queryByText('Monday:')).to.exist;
    expect(screen.queryByText('Tuesday:')).to.exist;
    expect(screen.queryByText('Wednesday:')).to.exist;
    expect(screen.queryByText('Thursday:')).to.exist;
    expect(screen.queryByText('Friday:')).to.exist;
    expect(screen.queryByText('Saturday:')).to.exist;

    expect(screen.queryByTestId('sunday-hours').textContent).to.equal('24/7');
    expect(screen.queryByTestId('monday-hours').textContent).to.equal('24/7');
    expect(screen.queryByTestId('tuesday-hours').textContent).to.equal('24/7');
    expect(screen.queryByTestId('wednesday-hours').textContent).to.equal(
      '24/7',
    );
    expect(screen.queryByTestId('thursday-hours').textContent).to.equal('24/7');
    expect(screen.queryByTestId('friday-hours').textContent).to.equal('24/7');
    expect(screen.queryByTestId('saturday-hours').textContent).to.equal('24/7');
  });

  it('should render LocationHours with the correct values given', () => {
    const hours = {
      tuesday: '24/7',
      wednesday: '24/7',
      thursday: '24/7',
      saturday: '24/7',
      sunday: '24/7',
    };

    const screen = render(
      <LocationHours
        location={makeTestFacility('va_health_facility', hours)}
      />,
    );

    expect(screen.queryByText('Sunday:')).to.exist;
    expect(screen.queryByText('Monday:')).not.to.exist;
    expect(screen.queryByText('Tuesday:')).to.exist;
    expect(screen.queryByText('Wednesday:')).to.exist;
    expect(screen.queryByText('Thursday:')).to.exist;
    expect(screen.queryByText('Friday:')).not.to.exist;
    expect(screen.queryByText('Saturday:')).to.exist;

    expect(screen.queryByTestId('sunday-hours').textContent).to.equal('24/7');
    expect(screen.queryByTestId('monday-hours')).not.to.exist;
    expect(screen.queryByTestId('tuesday-hours').textContent).to.equal('24/7');
    expect(screen.queryByTestId('wednesday-hours').textContent).to.equal(
      '24/7',
    );
    expect(screen.queryByTestId('thursday-hours').textContent).to.equal('24/7');
    expect(screen.queryByTestId('friday-hours')).not.to.exist;
    expect(screen.queryByTestId('saturday-hours').textContent).to.equal('24/7');
  });

  it('should render LocationHours with the correct values given', () => {
    const hours = {
      monday: '8:00 a.m. - 4:30 p.m.',
      wednesday: '24/7',
      thursday: '24/7',
      friday: '8:00 a.m. - 4:30 p.m.',
      sunday: '24/7',
    };

    const screen = render(
      <LocationHours
        location={makeTestFacility('va_health_facility', hours)}
      />,
    );

    expect(screen.queryByText('Sunday:')).to.exist;
    expect(screen.queryByText('Monday:')).to.exist;
    expect(screen.queryByText('Tuesday:')).not.to.exist;
    expect(screen.queryByText('Wednesday:')).to.exist;
    expect(screen.queryByText('Thursday:')).to.exist;
    expect(screen.queryByText('Friday:')).to.exist;
    expect(screen.queryByText('Saturday:')).not.to.exist;

    expect(screen.queryByTestId('sunday-hours').textContent).to.equal('24/7');
    expect(screen.queryByTestId('monday-hours').textContent).to.equal(
      '8:00 a.m. - 4:30 p.m.',
    );
    expect(screen.queryByTestId('tuesday-hours')).not.to.exist;
    expect(screen.queryByTestId('wednesday-hours').textContent).to.equal(
      '24/7',
    );
    expect(screen.queryByTestId('thursday-hours').textContent).to.equal('24/7');
    expect(screen.queryByTestId('friday-hours').textContent).to.equal(
      '8:00 a.m. - 4:30 p.m.',
    );
    expect(screen.queryByTestId('saturday-hours')).not.to.exist;
  });
});
