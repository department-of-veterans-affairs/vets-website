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
    // Use function because testing-library has trouble with text that spans multiple lines (newlines)?!?
    getByText((content, _) => {
      return (
        content.includes('you may have trouble using') &&
        content.includes('APPLICATION')
      );
    });
    getByText('July 4, 2019 at 9:00 a.m. ET');
    getByText('July 5, 2019 at 3:00 a.m. ET');
  });

  it('renders with default text if appTitle not provided', () => {
    const props = {
      endTime: new Date('July 5, 2019 03:00:00 EDT'),
      startTime: new Date('July 4, 2019 09:00:00 EDT'),
    };

    const { getByText } = render(<MHVDown {...props} />);
    // Use function because testing-library has trouble with text that spans multiple lines (newlines)?!?
    getByText((content, _) => {
      return (
        content.includes('you may have trouble using') &&
        content.includes('some of our health tools')
      );
    });
    getByText('July 4, 2019 at 9:00 a.m. ET');
    getByText('July 5, 2019 at 3:00 a.m. ET');
  });
});
