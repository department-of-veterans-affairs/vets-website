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

  it('should render textarea field', () => {
    const { container } = render(
      <BenefitsDetailsPage
        goForward={mockGoForward}
        data={{}}
        setFormData={mockSetFormData}
      />,
    );

    const textarea = container.querySelector('va-textarea');
    expect(textarea).to.exist;
  });

  it('should display benefit details data', () => {
    const data = {
      benefitsDetails: {
        benefitDetails: 'Education benefits under Post-9/11 GI Bill',
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

  it('should validate maxLength for benefit details', () => {
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
});
