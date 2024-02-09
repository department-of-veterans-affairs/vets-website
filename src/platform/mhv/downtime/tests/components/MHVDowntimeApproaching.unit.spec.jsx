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
    // Use function because testing-library has trouble with text that spans multiple lines (newlines)?!?
    getByText((content, _) => {
      return (
        content.includes('you may have trouble using') &&
        content.includes('APPLICATION')
      );
    });
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
    // Use function because testing-library has trouble with text that spans multiple lines (newlines)?!?
    getByText((content, _) => {
      return (
        content.includes('you may have trouble using') &&
        content.includes('some of our health tools')
      );
    });
    getByText(startString);
    getByText(endString);
  });
});
