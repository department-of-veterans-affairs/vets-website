import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import CardSection from './CardSection';

describe('VASS Component: CardSection', () => {
  it('should render all content with text content', () => {
    const { getByText } = render(
      <CardSection heading="Test Heading" textContent="Test content text" />,
    );

    expect(getByText('Test Heading')).to.exist;
    expect(getByText('Test content text')).to.exist;
  });

  it('should render with date content', () => {
    const mockDateContent = {
      dateTime: '2025-11-17T20:00:00Z',
      phoneNumber: '8008270611',
    };

    const { getByText, getByTestId } = render(
      <CardSection heading="When" dateContent={mockDateContent} />,
    );

    expect(getByText('When')).to.exist;
    expect(getByTestId('date-time-description')).to.exist;
    expect(getByTestId('add-to-calendar-button')).to.exist;
  });
});
