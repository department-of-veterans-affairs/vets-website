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
    // Use function because testing-library has trouble with text that spans multiple lines (newlines)?!?
    getByText((content, _) => {
      return (
        content.includes(timeInterval) &&
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

    const { getByText } = render(<MHVDown {...props} />);
    // Use function because testing-library has trouble with text that spans multiple lines (newlines)?!?
    getByText((content, _) => {
      return (
        content.includes(timeInterval) &&
        content.includes('you may have trouble using') &&
        content.includes('some of our health tools')
      );
    });
    getByText(startString);
    getByText(endString);
  });
});
