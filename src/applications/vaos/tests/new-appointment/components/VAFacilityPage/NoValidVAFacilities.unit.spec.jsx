import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { FETCH_STATUS } from '../../../../utils/constants';

import NoValidVAFacilities from '../../../../new-appointment/components/VAFacilityPage/NoValidVAFacilities';

const parentDetails = {
  name: 'Cheyenne VA Medical Center',
  address: {
    postalCode: '82001-5356',
    city: 'Cheyenne',
    state: 'WY',
    line: ['2360 East Pershing Boulevard'],
  },
  telecom: [
    {
      system: 'phone',
      value: '307-778-7550',
    },
  ],
  hoursOfOperation: [
    {
      daysOfWeek: ['mon'],
      allDay: false,
      openingTime: '08:00',
      closingTime: '16:00',
    },
    {
      daysOfWeek: ['tue'],
      allDay: true,
      openingTime: null,
      closingTime: null,
    },
  ],
};

describe('VAOS <NoValidVAFacilities>', () => {
  it('should display a loading indicator if FETCH_STATUS is loading', () => {
    const formContext = {
      facilityDetailsStatus: FETCH_STATUS.loading,
    };
    const screen = render(<NoValidVAFacilities formContext={formContext} />);

    expect(screen.getByRole('progressbar')).to.be.ok;
  });

  it('should not display a loading indicator if FETCH_STATUS is succeeded', () => {
    const formContext = {
      facilityDetailsStatus: FETCH_STATUS.succeeded,
    };
    const screen = render(<NoValidVAFacilities formContext={formContext} />);

    expect(screen.queryByRole('progressbar')).not.to.be.ok;
  });

  it('should render alert message', () => {
    const formContext = {
      typeOfCare: 'Mental health',
    };
    const screen = render(<NoValidVAFacilities formContext={formContext} />);

    expect(
      screen.getByRole('heading', {
        name: 'There are no mental health appointments at this location',
      }),
    ).to.be.ok;

    expect(screen.baseElement).to.contain('[aria-atomic="true"]');
  });

  it('should render facility info if parentDetails provided', () => {
    const formContext = {
      typeOfCare: 'Mental health',
      parentDetails,
    };
    const screen = render(<NoValidVAFacilities formContext={formContext} />);

    expect(
      screen.getByRole('heading', {
        name: 'There are no mental health appointments at this location',
      }),
    ).to.be.ok;

    expect(screen.getByText(new RegExp(`${parentDetails.name}`))).to.exist;
    expect(screen.getByText(new RegExp(`${parentDetails.address.line[0]}`))).to
      .exist;
    expect(screen.baseElement).to.contain.text(
      `${parentDetails.address.city}, ${parentDetails.address.state} ${
        parentDetails.address.postalCode
      }`,
    );
    expect(screen.getByText('Directions')).to.exist;
    expect(
      screen.getByRole('link', {
        name:
          'Directions to Cheyenne VA Medical Center Link opens in a new tab.',
      }),
    ).to.exist;
    expect(screen.getByText('Main phone:')).to.exist;
    expect(screen.getByRole('link', { name: '3 0 7. 7 7 8. 7 5 5 0.' })).to
      .exist;

    // Facility should be open on Monday
    expect(screen.getByText('8:00 a.m. - 4:00 p.m.')).to.be.ok;

    // Facility should be open on Tuesday all day
    expect(screen.getByText('24/7')).to.be.ok;

    // Facility should be closed on all other days
    const count = screen.getAllByText('Closed');
    expect(count.length).to.equal(5);
  });

  it('should render a link to facility locator if no parentDetails provided', () => {
    const formContext = {
      typeOfCare: 'Mental health',
      siteId: '442',
    };

    const screen = render(<NoValidVAFacilities formContext={formContext} />);

    expect(
      screen.getByText(
        /^You can find contact information for this medical center at/,
      ),
    ).to.be.ok;

    expect(
      screen.getByRole('link', {
        name: 'our facility locator tool Link opens in a new tab.',
      }),
    ).to.exist;
  });
});
