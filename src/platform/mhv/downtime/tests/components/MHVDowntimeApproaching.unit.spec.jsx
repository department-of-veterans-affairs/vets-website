import React from 'react';
import { render } from '@testing-library/react';

import MHVDowntimeApproaching from '../../components/MHVDowntimeApproaching';

const endString = 'END DATE';
const startString = 'START DATE';
const timeInterval = 'TIME INTERVAL';

describe('MHVDowntimeApproaching', () => {
  it('renders with human-formatted start and end times', () => {
    const props = {
      appTitle: 'APPLICATION',
      endString,
      startString,
      timeInterval,
    };

    const { getByText } = render(<MHVDowntimeApproaching {...props} />);
    getByText(/During this time, you won’t be able to use APPLICATION/i);
    getByText(startString);
    getByText(endString);
  });

  it('renders with default text if appTitle not provided', () => {
    const props = {
      endString,
      startString,
      timeInterval,
    };

    const { getByText } = render(<MHVDowntimeApproaching {...props} />);
    getByText(/you won’t be able to use our health tools/i);
    getByText(startString);
    getByText(endString);
  });
});
