/**
 * @module tests/pages/benefits-details.unit.spec
 * @description Unit tests for Benefits Details page component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { BenefitsDetailsPage } from './benefits-details';

describe('BenefitsDetailsPage', () => {
  const mockGoForward = () => {};
  const mockSetFormData = () => {};

  it('should render without errors', () => {
    const { container } = render(
      <BenefitsDetailsPage
        goForward={mockGoForward}
        data={{}}
        setFormData={mockSetFormData}
      />,
    );

    expect(container).to.exist;
  });

  it('should render all required fields', () => {
    const { container } = render(
      <BenefitsDetailsPage
        goForward={mockGoForward}
        data={{}}
        setFormData={mockSetFormData}
      />,
    );

    // Check for benefit type textarea
    const textarea = container.querySelector('va-textarea');
    expect(textarea).to.exist;

    // Check for date fields
    const dateFields = container.querySelectorAll('va-memorable-date');
    expect(dateFields.length).to.equal(3); // startReceivingDate, firstPaymentDate, stopReceivingDate
  });

  it('should display benefit details data', () => {
    const data = {
      benefitsDetails: {
        benefitType: 'Education benefits under Post-9/11 GI Bill',
        grossMonthlyAmount: '2000',
        startReceivingDate: '2023-01-15',
        firstPaymentDate: '2023-02-01',
        stopReceivingDate: '2027-12-31',
      },
    };
    const { container } = render(
      <BenefitsDetailsPage
        goForward={mockGoForward}
        data={data}
        setFormData={mockSetFormData}
      />,
    );

    const textarea = container.querySelector('va-textarea');
    expect(textarea.getAttribute('value')).to.equal(
      'Education benefits under Post-9/11 GI Bill',
    );
  });

  it('should use dynamic veteran name in date field labels', () => {
    const data = {
      veteranInformation: {
        firstName: 'John',
        lastName: 'Doe',
      },
    };
    const { container } = render(
      <BenefitsDetailsPage
        goForward={mockGoForward}
        data={data}
        setFormData={mockSetFormData}
      />,
    );

    const dateFields = container.querySelectorAll('va-memorable-date');
    expect(dateFields.length).to.equal(3);

    const startLabel = dateFields[0].getAttribute('label');
    expect(startLabel).to.include('John Doe');
    expect(startLabel).to.include('start receiving');

    const firstPaymentLabel = dateFields[1].getAttribute('label');
    expect(firstPaymentLabel).to.include('John Doe');
    expect(firstPaymentLabel).to.include('first payment');

    const stopLabel = dateFields[2].getAttribute('label');
    expect(stopLabel).to.include('John Doe');
    expect(stopLabel).to.include('no longer receive');
  });

  it('should use "the Veteran" when name is missing', () => {
    const { container } = render(
      <BenefitsDetailsPage
        goForward={mockGoForward}
        data={{}}
        setFormData={mockSetFormData}
      />,
    );

    const dateFields = container.querySelectorAll('va-memorable-date');
    expect(dateFields.length).to.equal(3);

    const startLabel = dateFields[0].getAttribute('label');
    expect(startLabel).to.include('the Veteran');

    const firstPaymentLabel = dateFields[1].getAttribute('label');
    expect(firstPaymentLabel).to.include('the Veteran');

    const stopLabel = dateFields[2].getAttribute('label');
    expect(stopLabel).to.include('the Veteran');
  });

  it('should handle undefined data', () => {
    const { container } = render(
      <BenefitsDetailsPage
        goForward={mockGoForward}
        data={undefined}
        setFormData={mockSetFormData}
      />,
    );

    expect(container).to.exist;
  });

  it('should validate maxLength for benefit type', () => {
    const { container } = render(
      <BenefitsDetailsPage
        goForward={mockGoForward}
        data={{}}
        setFormData={mockSetFormData}
      />,
    );

    const textarea = container.querySelector('va-textarea');
    expect(textarea.getAttribute('maxlength')).to.equal('500');
  });

  it('should mark required date fields as required', () => {
    const { container } = render(
      <BenefitsDetailsPage
        goForward={mockGoForward}
        data={{}}
        setFormData={mockSetFormData}
      />,
    );

    const dateFields = container.querySelectorAll('va-memorable-date');
    expect(dateFields.length).to.equal(3);

    // First two date fields should be required
    expect(dateFields[0].hasAttribute('required')).to.be.true;
    expect(dateFields[1].hasAttribute('required')).to.be.true;
  });
});
