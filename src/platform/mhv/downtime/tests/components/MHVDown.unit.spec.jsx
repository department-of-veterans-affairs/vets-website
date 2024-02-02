import React from 'react';
import { render } from '@testing-library/react';

import MHVDown from '../../components/MHVDown';

describe('MHVDown', () => {
  it('renders with human-formatted start and end times', () => {
    const props = {
      appTitle: 'APPLICATION',
      endTime: new Date('July 5, 2019 03:00:00 EDT'),
      startTime: new Date('July 4, 2019 09:00:00 EDT'),
    };

    const { getByText } = render(<MHVDown {...props} />);
    getByText('APPLICATION is down for maintenance');
    getByText('Start time: July 4, 2019 at 9:00 a.m. ET');
    getByText('End time: July 5, 2019 at 3:00 a.m. ET');
  });
});
