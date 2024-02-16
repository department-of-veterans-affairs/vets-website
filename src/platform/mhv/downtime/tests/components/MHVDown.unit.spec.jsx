import React from 'react';
import { render } from '@testing-library/react';

import MHVDown from '../../components/MHVDown';

const endString = 'END DATE';
const startString = 'START DATE';
const timeInterval = 'TIME INTERVAL';

describe('MHVDown', () => {
  it('renders app title when provided', () => {
    const props = {
      appTitle: 'APPLICATION',
      endString,
      startString,
      timeInterval,
    };

    const { getByText } = render(<MHVDown {...props} />);
    getByText(/The maintenance will last TIME INTERVAL/i);
    getByText(/you may have trouble using APPLICATION/i);
    getByText(startString);
    getByText(endString);
  });

  it('renders with default text if appTitle not provided', () => {
    const props = {
      endString,
      startString,
      timeInterval,
    };

    const { getByText } = render(<MHVDown {...props} />);
    getByText(/The maintenance will last TIME INTERVAL/i);
    getByText(startString);
    getByText(endString);
  });
});
