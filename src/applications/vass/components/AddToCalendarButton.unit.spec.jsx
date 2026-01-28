import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import AddToCalendarButton from './AddToCalendarButton';
import { createAppointmentData } from '../utils/appointments';

describe('VASS Component: AddToCalendarButton', () => {
  const mockAppointment = createAppointmentData();

  it('should render all content', () => {
    const { getByTestId } = render(
      <AddToCalendarButton appointment={mockAppointment} />,
    );

    expect(getByTestId('add-to-calendar-link')).to.exist;
    expect(getByTestId('add-to-calendar-button')).to.exist;
  });
});
