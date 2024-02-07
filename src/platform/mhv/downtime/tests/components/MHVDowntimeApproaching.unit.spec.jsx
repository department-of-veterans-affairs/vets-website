import React from 'react';
import { render } from '@testing-library/react';

import MHVDowntimeApproaching from '../../components/MHVDowntimeApproaching';

describe('MHVDowntimeApproaching', () => {
  it('renders with human-formatted start and end times', () => {
    const props = {
      appTitle: 'APPLICATION',
      endTime: new Date('July 5, 2019 03:00:00 EDT'),
      startTime: new Date('July 4, 2019 09:00:00 EDT'),
    };

    const { getByText } = render(<MHVDowntimeApproaching {...props} />);
    getByText('Upcoming maintenance on APPLICATION');
    getByText('July 4, 2019 at 9:00 a.m. ET');
    getByText('July 5, 2019 at 3:00 a.m. ET');
  });
});
