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

  it('should render all required form fields', () => {
    const { container } = render(
      <EmploymentLastPaymentPage
        goForward={mockGoForward}
        data={{}}
        setFormData={mockSetFormData}
      />,
    );

    const dateFields = container.querySelectorAll('va-memorable-date');
    const radioFields = container.querySelectorAll('va-radio');
    const currencyFields = container.querySelectorAll('va-text-input');

    expect(dateFields.length).to.equal(1);
    expect(radioFields.length).to.equal(1);
    expect(currencyFields.length).to.equal(1);
  });

  it('should show lump sum fields when lumpSumPayment is yes', () => {
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

    const dateFields = container.querySelectorAll('va-memorable-date');
    const currencyFields = container.querySelectorAll('va-text-input');

    expect(dateFields.length).to.equal(2);
    expect(currencyFields.length).to.equal(2);
  });

  it('should hide lump sum fields when lumpSumPayment is no', () => {
    const data = {
      employmentLastPayment: {
        lumpSumPayment: 'no',
      },
    };
    const { container } = render(
      <EmploymentLastPaymentPage
        goForward={mockGoForward}
        data={data}
        setFormData={mockSetFormData}
      />,
    );

    const dateFields = container.querySelectorAll('va-memorable-date');
    const currencyFields = container.querySelectorAll('va-text-input');

    expect(dateFields.length).to.equal(1);
    expect(currencyFields.length).to.equal(1);
  });

  it('should display correct label for lump sum question', () => {
    const { container } = render(
      <EmploymentLastPaymentPage
        goForward={mockGoForward}
        data={{}}
        setFormData={mockSetFormData}
      />,
    );

    const radioField = container.querySelector('va-radio');
    expect(radioField.getAttribute('label')).to.equal(
      'Was a lump sum payment made?',
    );
  });

  it('should display hint text for lump sum question', () => {
    const { container } = render(
      <EmploymentLastPaymentPage
        goForward={mockGoForward}
        data={{}}
        setFormData={mockSetFormData}
      />,
    );

    const radioField = container.querySelector('va-radio');
    expect(radioField.getAttribute('hint')).to.equal(
      '[text explaining how this differs from standard pay check]',
    );
  });

  it('should mark date of last payment as required', () => {
    const { container } = render(
      <EmploymentLastPaymentPage
        goForward={mockGoForward}
        data={{}}
        setFormData={mockSetFormData}
      />,
    );

    const dateFields = container.querySelectorAll('va-memorable-date');
    expect(dateFields[0].hasAttribute('required')).to.be.true;
  });

  it('should display correct label for lump sum date', () => {
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

    const dateFields = container.querySelectorAll('va-memorable-date');
    expect(dateFields[1].getAttribute('label')).to.equal(
      'When was the lump sum paid?',
    );
  });

  it('should mark lump sum date as required', () => {
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

    const dateFields = container.querySelectorAll('va-memorable-date');
    expect(dateFields[1].hasAttribute('required')).to.be.true;
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
