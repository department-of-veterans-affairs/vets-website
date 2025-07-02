import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { addHours, addMinutes } from 'date-fns';

import DowntimeApproaching from '../components/DowntimeApproaching';

describe('<DowntimeApproaching>', () => {
  it('should render with a properly formatted date and times', () => {
    const dt = new Date('2025-06-25T16:00:00-00:00');
    const startTime = addMinutes(dt, 30);
    const endTime = addHours(startTime, 1);
    const props = {
      appTitle: 'test',
      startTime,
      endTime,
      initializeDowntimeWarnings: () => {},
      isDowntimeWarningDismissed: false,
      dismissDowntimeWarning: () => {},
      children: '',
      content: '',
    };
    const { getByText } = render(
      <div>
        <DowntimeApproaching {...props} />
      </div>,
    );
    expect(getByText(/June 25th/)).to.exist;
    expect(
      getByText(
        /between\s+\d{1,2}:\d{2}\s+(A|P)M\s+and\s+\d{1,2}:\d{2}\s+(A|P)M/,
      ),
    ).to.exist;
  });
});
