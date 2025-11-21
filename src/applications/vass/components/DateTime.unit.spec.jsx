import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import DateTime from './DateTime';

describe('VASS Component: DateTime', () => {
  const mockDateTime = '2025-11-17T20:00:00Z';

  it('should render all content', () => {
    const { getByTestId } = render(<DateTime dateTime={mockDateTime} />);

    expect(getByTestId('date-time-description')).to.exist;
  });

  it('should format date in correct format', () => {
    const { getByTestId } = render(<DateTime dateTime={mockDateTime} />);

    const dateTimeElement = getByTestId('date-time-description');
    const text = dateTimeElement.textContent;

    // Check for weekday, month, day, year format (e.g., "Monday, November 17, 2025")
    expect(text).to.match(/\w+,\s\w+\s\d{1,2},\s\d{4}/);
    // Check for time format (e.g., "03:00 PM EST" or "3:00 pm EST")
    expect(text).to.match(/\d{1,2}:\d{2}\s[APap][Mm]/);
  });
});
