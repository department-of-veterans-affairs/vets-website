/**
 * @module tests/pages/employment-dates-details.unit.spec
 * @description Unit tests for Employment Dates and Details page component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { EmploymentDatesDetailsPage } from './employment-dates-details';

describe('EmploymentDatesDetailsPage', () => {
  const mockGoForward = () => {};
  const mockSetFormData = () => {};

  it('should render without errors', () => {
    const { container } = render(
      <EmploymentDatesDetailsPage
        goForward={mockGoForward}
        data={{}}
        setFormData={mockSetFormData}
      />,
    );

    expect(container).to.exist;
  });

  it('should render all form fields', () => {
    const { container } = render(
      <EmploymentDatesDetailsPage
        goForward={mockGoForward}
        data={{}}
        setFormData={mockSetFormData}
      />,
    );

    const dateFields = container.querySelectorAll('va-memorable-date');
    const textareas = container.querySelectorAll('va-textarea');
    // NumberField renders as va-text-input with inputmode="numeric"
    const numberFields = container.querySelectorAll(
      'va-text-input[inputmode="numeric"]',
    );

    expect(dateFields.length).to.be.at.least(2);
    expect(textareas.length).to.be.at.least(1);
    expect(numberFields.length).to.be.at.least(2);
  });

  it('should display type of work data', () => {
    const data = {
      employmentDatesDetails: {
        typeOfWork: 'Commanding officer of USS Enterprise',
      },
    };
    const { container } = render(
      <EmploymentDatesDetailsPage
        goForward={mockGoForward}
        data={data}
        setFormData={mockSetFormData}
      />,
    );

    const textarea = container.querySelector('va-textarea');
    expect(textarea.getAttribute('value')).to.equal(
      'Commanding officer of USS Enterprise',
    );
  });

  it('should handle undefined data', () => {
    const { container } = render(
      <EmploymentDatesDetailsPage
        goForward={mockGoForward}
        data={undefined}
        setFormData={mockSetFormData}
      />,
    );

    expect(container).to.exist;
  });

  it('should validate maxLength for type of work', () => {
    const { container } = render(
      <EmploymentDatesDetailsPage
        goForward={mockGoForward}
        data={{}}
        setFormData={mockSetFormData}
      />,
    );

    const textarea = container.querySelector('va-textarea');
    expect(textarea.getAttribute('maxlength')).to.equal('1000');
  });
});
