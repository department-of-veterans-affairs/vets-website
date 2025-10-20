/**
 * @module tests/pages/employment-concessions.unit.spec
 * @description Unit tests for Employment Concessions page component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { EmploymentConcessionsPage } from './employment-concessions';

describe('EmploymentConcessionsPage', () => {
  const mockGoForward = () => {};
  const mockSetFormData = () => {};

  it('should render without errors', () => {
    const { container } = render(
      <EmploymentConcessionsPage
        goForward={mockGoForward}
        data={{}}
        setFormData={mockSetFormData}
      />,
    );

    expect(container).to.exist;
    expect(container.textContent).to.include('Concessions');
  });

  it('should render concessions textarea field', () => {
    const { container } = render(
      <EmploymentConcessionsPage
        goForward={mockGoForward}
        data={{}}
        setFormData={mockSetFormData}
      />,
    );

    const textarea = container.querySelector('va-textarea');
    expect(textarea).to.exist;
  });

  it('should display concessions data', () => {
    const data = {
      employmentConcessions: {
        concessions: 'Modified duty schedule due to disability',
      },
    };
    const { container } = render(
      <EmploymentConcessionsPage
        goForward={mockGoForward}
        data={data}
        setFormData={mockSetFormData}
      />,
    );

    const textarea = container.querySelector('va-textarea');
    expect(textarea.getAttribute('value')).to.equal(
      'Modified duty schedule due to disability',
    );
  });

  it('should handle empty concessions', () => {
    const data = {
      employmentConcessions: {
        concessions: '',
      },
    };
    const { container } = render(
      <EmploymentConcessionsPage
        goForward={mockGoForward}
        data={data}
        setFormData={mockSetFormData}
      />,
    );

    const textarea = container.querySelector('va-textarea');
    expect(textarea.getAttribute('value')).to.equal('');
  });

  it('should handle undefined data', () => {
    const { container } = render(
      <EmploymentConcessionsPage
        goForward={mockGoForward}
        data={undefined}
        setFormData={mockSetFormData}
      />,
    );

    expect(container).to.exist;
  });

  it('should validate maxLength attribute', () => {
    const { container } = render(
      <EmploymentConcessionsPage
        goForward={mockGoForward}
        data={{}}
        setFormData={mockSetFormData}
      />,
    );

    const textarea = container.querySelector('va-textarea');
    expect(textarea.getAttribute('maxlength')).to.equal('1000');
  });
});
