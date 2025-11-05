/**
 * @module tests/pages/employment-dates.unit.spec
 * @description Unit tests for Employment Dates page component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { EmploymentDatesPage } from './employment-dates';

describe('EmploymentDatesPage', () => {
  const mockGoForward = () => {};
  const mockSetFormData = () => {};

  it('should render without errors', () => {
    const { container } = render(
      <EmploymentDatesPage
        goForward={mockGoForward}
        data={{}}
        setFormData={mockSetFormData}
      />,
    );

    expect(container).to.exist;
  });

  it('should render all form fields', () => {
    const { container } = render(
      <EmploymentDatesPage
        goForward={mockGoForward}
        data={{}}
        setFormData={mockSetFormData}
      />,
    );

    const dateFields = container.querySelectorAll('va-memorable-date');
    const textareas = container.querySelectorAll('va-textarea');

    expect(dateFields.length).to.be.at.least(2); // beginningDate, endingDate
    expect(textareas.length).to.be.at.least(1); // typeOfWork
  });

  it('should display type of work data', () => {
    const data = {
      employmentDates: {
        typeOfWork: 'Commanding officer of Slave I',
      },
    };
    const { container } = render(
      <EmploymentDatesPage
        goForward={mockGoForward}
        data={data}
        setFormData={mockSetFormData}
      />,
    );

    const textarea = container.querySelector('va-textarea');
    expect(textarea.getAttribute('value')).to.equal(
      'Commanding officer of Slave I',
    );
  });

  it('should handle undefined data', () => {
    const { container } = render(
      <EmploymentDatesPage
        goForward={mockGoForward}
        data={undefined}
        setFormData={mockSetFormData}
      />,
    );

    expect(container).to.exist;
  });

  it('should validate maxLength for type of work', () => {
    const { container } = render(
      <EmploymentDatesPage
        goForward={mockGoForward}
        data={{}}
        setFormData={mockSetFormData}
      />,
    );

    const textarea = container.querySelector('va-textarea');
    expect(textarea.getAttribute('maxlength')).to.equal('1000');
  });
});
