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
        terminationReason: 'Medical discharge from Guild',
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
      'Medical discharge from Guild',
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

  it('should display context paragraph with ending date', () => {
    const data = {
      employmentDates: {
        endingDate: '2020-12-31',
      },
    };
    const { container } = render(
      <EmploymentTerminationPage
        goForward={mockGoForward}
        data={data}
        setFormData={mockSetFormData}
      />,
    );

    const text = container.textContent;
    expect(text).to.include('On a previous page');
    expect(text).to.include('stopped working on');
    expect(text).to.include('December');
    expect(text).to.include('31');
    expect(text).to.include('2020');
  });

  it('should use veteran name in context paragraph', () => {
    const data = {
      veteranInformation: {
        firstName: 'Boba',
        lastName: 'Fett',
      },
      employmentDates: {
        endingDate: '2020-12-31',
      },
    };
    const { container } = render(
      <EmploymentTerminationPage
        goForward={mockGoForward}
        data={data}
        setFormData={mockSetFormData}
      />,
    );

    const text = container.textContent;
    expect(text).to.include('Boba Fett');
    expect(text).to.include('stopped working on');
  });

  it('should use "the Veteran" when no name provided', () => {
    const data = {
      employmentDates: {
        endingDate: '2020-12-31',
      },
    };
    const { container } = render(
      <EmploymentTerminationPage
        goForward={mockGoForward}
        data={data}
        setFormData={mockSetFormData}
      />,
    );

    const text = container.textContent;
    expect(text).to.include('the Veteran');
    expect(text).to.include('stopped working on');
  });

  it('should display hint text for termination reason', () => {
    const { container } = render(
      <EmploymentTerminationPage
        goForward={mockGoForward}
        data={{}}
        setFormData={mockSetFormData}
      />,
    );

    const textarea = container.querySelector('va-textarea');
    expect(textarea.getAttribute('hint')).to.equal(
      'If they retired on disability, please specify.',
    );
  });

  it('should mark date last worked as required', () => {
    const { container } = render(
      <EmploymentTerminationPage
        goForward={mockGoForward}
        data={{}}
        setFormData={mockSetFormData}
      />,
    );

    const dateField = container.querySelector('va-memorable-date');
    expect(dateField.hasAttribute('required')).to.be.true;
  });

  it('should display correct label for termination reason', () => {
    const { container } = render(
      <EmploymentTerminationPage
        goForward={mockGoForward}
        data={{}}
        setFormData={mockSetFormData}
      />,
    );

    const textarea = container.querySelector('va-textarea');
    expect(textarea.getAttribute('label')).to.equal(
      'Reason for termination of employment',
    );
  });

  it('should display correct label for date last worked', () => {
    const { container } = render(
      <EmploymentTerminationPage
        goForward={mockGoForward}
        data={{}}
        setFormData={mockSetFormData}
      />,
    );

    const dateField = container.querySelector('va-memorable-date');
    expect(dateField.getAttribute('label')).to.equal('Date last worked');
  });

  it('should handle missing ending date gracefully', () => {
    const data = {
      employmentDates: {},
    };
    const { container } = render(
      <EmploymentTerminationPage
        goForward={mockGoForward}
        data={data}
        setFormData={mockSetFormData}
      />,
    );

    const text = container.textContent;
    expect(text).to.include('you indicated that');
    expect(text).to.include('stopped working. Why did they stop working?');
    expect(text).to.not.include('[date not provided]');
  });
});
