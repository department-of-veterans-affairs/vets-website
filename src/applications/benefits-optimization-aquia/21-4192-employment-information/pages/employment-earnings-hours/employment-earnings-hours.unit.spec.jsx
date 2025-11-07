/**
 * @module tests/pages/employment-earnings-hours.unit.spec
 * @description Unit tests for Employment Earnings and Hours page component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { EmploymentEarningsHoursPage } from './employment-earnings-hours';

describe('EmploymentEarningsHoursPage', () => {
  const mockGoForward = () => {};
  const mockSetFormData = () => {};

  it('should render without errors', () => {
    const { container } = render(
      <EmploymentEarningsHoursPage
        goForward={mockGoForward}
        data={{}}
        setFormData={mockSetFormData}
      />,
    );

    expect(container).to.exist;
  });

  it('should render all form fields', () => {
    const { container } = render(
      <EmploymentEarningsHoursPage
        goForward={mockGoForward}
        data={{}}
        setFormData={mockSetFormData}
      />,
    );

    const textFields = container.querySelectorAll('va-text-input');

    // Should have 4 fields: amountEarned, timeLost, dailyHours, weeklyHours
    expect(textFields.length).to.be.at.least(4);
  });

  it('should display earnings data', () => {
    const data = {
      employmentEarningsHours: {
        amountEarned: '50000',
      },
    };
    const { container } = render(
      <EmploymentEarningsHoursPage
        goForward={mockGoForward}
        data={data}
        setFormData={mockSetFormData}
      />,
    );

    // Find the amountEarned field
    const textFields = container.querySelectorAll('va-text-input');
    const amountEarnedField = textFields[0]; // First field is amountEarned
    expect(amountEarnedField).to.exist;
    expect(amountEarnedField.getAttribute('value')).to.equal('50000');
  });

  it('should handle undefined data', () => {
    const { container } = render(
      <EmploymentEarningsHoursPage
        goForward={mockGoForward}
        data={undefined}
        setFormData={mockSetFormData}
      />,
    );

    expect(container).to.exist;
  });
});
