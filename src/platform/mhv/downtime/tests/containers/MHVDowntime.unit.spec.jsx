import React from 'react';
import { render } from '@testing-library/react';

import { externalServiceStatus } from '@department-of-veterans-affairs/platform-monitoring/exports';

import MHVDowntime from '../../containers/MHVDowntime';

describe('MHVDowntime', () => {
  it('renders MHVDown when a service is down', () => {
    const now = new Date();
    const later = new Date(now).setHours(now.getHours() + 4);

    const mockServiceProps = {
      endTime: later,
      startTime: now,
      externalService: 'mhv_sm',
    };
    const mockProps = {
      appTitle: 'MHV Test',
      children: ' ',
      status: externalServiceStatus.down,
      ...mockServiceProps,
    };
    const { getByRole } = render(<MHVDowntime {...mockProps} />);
    getByRole('heading', { level: 3, name: /MHV Test is down/ });
  });

  it('renders MHVDowntimeApproaching when a service is going down within an hour', () => {
    // Create a starting datetime 30 minutes into the future, though `status` is what really controls what renders
    const soon = new Date(Date.now());
    soon.setMinutes(soon.getMinutes() + 30);
    const later = new Date(soon).setHours(soon.getHours() + 4);

    const mockServiceProps = {
      endTime: later,
      startTime: soon,
      externalService: 'mhv_sm',
    };
    const mockProps = {
      appTitle: 'MHV Test',
      children: ' ',
      status: externalServiceStatus.downtimeApproaching,
      ...mockServiceProps,
    };
    const { getByRole } = render(<MHVDowntime {...mockProps} />);
    getByRole('heading', { level: 3, name: /MHV Test will be down/ });
  });

  it('renders child content when no matching services are down', () => {
    const mockServiceProps = {
      endTime: undefined,
      startTime: undefined,
      externalService: undefined,
    };
    const mockProps = {
      appTitle: 'MHV Test',
      children: <p>Child content renders</p>,
      status: externalServiceStatus.ok,
      ...mockServiceProps,
    };
    const { getByText } = render(<MHVDowntime {...mockProps} />);
    getByText('Child content renders');
  });
});
