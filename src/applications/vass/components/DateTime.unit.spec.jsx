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
});
