/**
 * @module tests/pages/employment-last-payment.unit.spec
 * @description Unit tests for Employment Last Payment page component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { EmploymentLastPaymentPage } from './employment-last-payment';

describe('EmploymentLastPaymentPage', () => {
  const mockGoForward = () => {};
  const mockSetFormData = () => {};

  it('should render without errors', () => {
    const { container } = render(
      <EmploymentLastPaymentPage
        goForward={mockGoForward}
        data={{}}
        setFormData={mockSetFormData}
      />,
    );

    expect(container).to.exist;
    expect(container.textContent).to.include('Last payment');
  });

  it('should render all form fields', () => {
    const { container } = render(
      <EmploymentLastPaymentPage
        goForward={mockGoForward}
        data={{}}
        setFormData={mockSetFormData}
      />,
    );

    const dateFields = container.querySelectorAll('va-memorable-date');
    const radioFields = container.querySelectorAll('va-radio');

    expect(dateFields.length).to.be.at.least(2);
    expect(radioFields.length).to.be.at.least(1);
  });

  it('should display lump sum payment data', () => {
    const data = {
      employmentLastPayment: {
        lumpSumPayment: 'yes',
      },
    };
    const { container } = render(
      <EmploymentLastPaymentPage
        goForward={mockGoForward}
        data={data}
        setFormData={mockSetFormData}
      />,
    );

    const radioField = container.querySelector('va-radio');
    expect(radioField.getAttribute('value')).to.equal('yes');
  });

  it('should handle undefined data', () => {
    const { container } = render(
      <EmploymentLastPaymentPage
        goForward={mockGoForward}
        data={undefined}
        setFormData={mockSetFormData}
      />,
    );

    expect(container).to.exist;
  });
});
