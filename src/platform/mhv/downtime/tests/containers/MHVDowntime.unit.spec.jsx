import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { addHours, addMinutes } from 'date-fns';

import { externalServiceStatus } from '@department-of-veterans-affairs/platform-monitoring/exports';

import MHVDowntime from '../../containers/MHVDowntime';

/*
 * NOTE: Tests will run in various timezones, so look for formatting rather than exact datetimes
 */

describe('MHVDowntime', () => {
  it('renders MHVDown when a service is down', () => {
    const now = new Date();
    const later = addHours(now, 4);

    const mockServiceProps = {
      endTime: later,
      startTime: now,
      externalService: 'mhv_sm',
    };
    const mockProps = {
      status: externalServiceStatus.down,
      ...mockServiceProps,
    };
    const { getByRole, getByText } = render(<MHVDowntime {...mockProps} />);
    getByRole('heading', { level: 2, name: 'Maintenance on My HealtheVet' });
    getByText(/our health tools/i);
  });

  it('renders MHVDowntimeApproaching and children when a service is going down within an hour', () => {
    // Create a starting datetime 30 minutes into the future, though `status` is what really controls what renders
    const soon = addMinutes(new Date(), 30);
    const later = addHours(soon, 4);

    const mockServiceProps = {
      endTime: later,
      startTime: soon,
      externalService: 'mhv_sm',
    };
    const mockProps = {
      status: externalServiceStatus.downtimeApproaching,
      children: <p>Child content lives here.</p>,
      ...mockServiceProps,
    };
    const { getByRole, getByText } = render(<MHVDowntime {...mockProps} />);
    getByRole('heading', {
      level: 2,
      name: 'Upcoming maintenance on My HealtheVet',
    });
    getByText(/you won’t be able to use our health tools/i);
    getByText(/child content lives here/i);
  });

  it('renders child content when no matching services are down', () => {
    const mockServiceProps = {
      endTime: undefined,
      startTime: undefined,
      externalService: undefined,
    };
    const mockProps = {
      children: <p>Child content renders</p>,
      status: externalServiceStatus.ok,
      ...mockServiceProps,
    };
    const { getByText } = render(<MHVDowntime {...mockProps} />);
    getByText('Child content renders');
  });

  it('renders content with vague time interval and no start/end time if no valid dates provided', () => {
    const mockServiceProps = {
      endTime: {},
      startTime: undefined,
      externalService: 'mhv_sm',
    };
    const mockProps = {
      status: externalServiceStatus.downtimeApproaching,
      ...mockServiceProps,
    };

    const { getByText, queryByText } = render(<MHVDowntime {...mockProps} />);
    getByText(/The maintenance will last some time/i);
    getByText(/During this time, you won’t be able to use our health tools/i);
    expect(queryByText('July 4, 2019 at 9:00 a.m. ET')).to.be.null;
    expect(queryByText('July 5, 2019 at 3:00 a.m. ET')).to.be.null;
  });

  it('renders content with vague time interval and start time if end time does not exist', () => {
    const mockServiceProps = {
      endTime: null,
      startTime: new Date('July 4, 2019 09:00:00 EDT'),
      externalService: 'mhv_sm',
    };
    const mockProps = {
      status: externalServiceStatus.downtimeApproaching,
      ...mockServiceProps,
    };

    const { getByText, queryByText } = render(<MHVDowntime {...mockProps} />);
    getByText(/The maintenance will last some time/i);
    getByText(/During this time, you won’t be able to use our health tools/i);
    getByText(/July 4, 2019 at \d:\d{2} (a|p)\.m\. [A-Z]{1,2}T/);
    expect(queryByText('July 5, 2019 at 3:00 a.m. ET')).to.be.null;
  });

  it('renders content with vague time interval and end time if start time does not exist', () => {
    const mockServiceProps = {
      endTime: new Date('July 7, 2019 09:00:00 EDT'),
      startTime: null,
      externalService: 'mhv_sm',
    };
    const mockProps = {
      status: externalServiceStatus.downtimeApproaching,
      ...mockServiceProps,
    };

    const { getByText } = render(<MHVDowntime {...mockProps} />);
    getByText(/The maintenance will last some time/i);
    getByText(/During this time, you won’t be able to use our health tools/i);
    getByText(/July 7, 2019 at \d:\d{2} (a|p)\.m\. [A-Z]{1,2}T/);
  });
});
