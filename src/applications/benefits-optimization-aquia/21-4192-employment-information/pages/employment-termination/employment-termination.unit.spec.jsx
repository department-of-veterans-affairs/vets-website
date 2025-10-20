/**
 * @module tests/pages/employment-termination.unit.spec
 * @description Unit tests for Employment Termination page component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { EmploymentTerminationPage } from './employment-termination';

describe('EmploymentTerminationPage', () => {
  const mockGoForward = () => {};
  const mockSetFormData = () => {};

  it('should render without errors', () => {
    const { container } = render(
      <EmploymentTerminationPage
        goForward={mockGoForward}
        data={{}}
        setFormData={mockSetFormData}
      />,
    );

    expect(container).to.exist;
    expect(container.textContent).to.include('Termination of employment');
  });

  it('should render termination reason textarea', () => {
    const { container } = render(
      <EmploymentTerminationPage
        goForward={mockGoForward}
        data={{}}
        setFormData={mockSetFormData}
      />,
    );

    const textarea = container.querySelector('va-textarea');
    expect(textarea).to.exist;
  });

  it('should render date last worked field', () => {
    const { container } = render(
      <EmploymentTerminationPage
        goForward={mockGoForward}
        data={{}}
        setFormData={mockSetFormData}
      />,
    );

    const dateField = container.querySelector('va-memorable-date');
    expect(dateField).to.exist;
  });

  it('should display termination reason data', () => {
    const data = {
      employmentTermination: {
        terminationReason: 'Medical discharge from Starfleet',
      },
    };
    const { container } = render(
      <EmploymentTerminationPage
        goForward={mockGoForward}
        data={data}
        setFormData={mockSetFormData}
      />,
    );

    const textarea = container.querySelector('va-textarea');
    expect(textarea.getAttribute('value')).to.equal(
      'Medical discharge from Starfleet',
    );
  });

  it('should handle undefined data', () => {
    const { container } = render(
      <EmploymentTerminationPage
        goForward={mockGoForward}
        data={undefined}
        setFormData={mockSetFormData}
      />,
    );

    expect(container).to.exist;
  });

  it('should validate maxLength for termination reason', () => {
    const { container } = render(
      <EmploymentTerminationPage
        goForward={mockGoForward}
        data={{}}
        setFormData={mockSetFormData}
      />,
    );

    const textarea = container.querySelector('va-textarea');
    expect(textarea.getAttribute('maxlength')).to.equal('1000');
  });
});
