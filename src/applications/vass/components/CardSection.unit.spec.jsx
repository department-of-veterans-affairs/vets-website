import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import CardSection from './CardSection';
import { createAppointmentData } from '../utils/appointments';

describe('VASS Component: CardSection', () => {
  it('should render all content with text content', () => {
    const { getByText } = render(
      <CardSection heading="Test Heading" textContent="Test content text" />,
    );

    expect(getByText('Test Heading')).to.exist;
    expect(getByText('Test content text')).to.exist;
  });

  it('should render with date content', () => {
    const mockAppointmentData = createAppointmentData();

    const { getByText, getByTestId } = render(
      <CardSection heading="When" appointmentData={mockAppointmentData} />,
    );

    expect(getByText('When')).to.exist;
    expect(getByTestId('date-time-description')).to.exist;
    expect(getByTestId('add-to-calendar-button')).to.exist;
  });
});
