import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import AddToCalendarButton from './AddToCalendarButton';

describe('VASS Component: AddToCalendarButton', () => {
  const mockAppointment = {
    dateTime: '2025-11-17T20:00:00Z',
  };

  it('should render all content', () => {
    const { getByTestId } = render(
      <AddToCalendarButton appointment={mockAppointment} />,
    );

    expect(getByTestId('add-to-calendar-link')).to.exist;
    expect(getByTestId('add-to-calendar-button')).to.exist;
  });
});
