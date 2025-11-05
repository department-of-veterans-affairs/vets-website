/**
 * @module tests/pages/duty-status-details.unit.spec
 * @description Unit tests for Duty Status Details page component
 */

import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { DutyStatusDetailsPage } from './duty-status-details';

describe('DutyStatusDetailsPage', () => {
  const mockGoForward = () => {};
  const mockSetFormData = () => {};

  it('should render without errors', () => {
    const { container } = render(
      <DutyStatusDetailsPage
        goForward={mockGoForward}
        data={{}}
        setFormData={mockSetFormData}
      />,
    );

    expect(container).to.exist;
  });

  it('should render textarea field', () => {
    const { container } = render(
      <DutyStatusDetailsPage
        goForward={mockGoForward}
        data={{}}
        setFormData={mockSetFormData}
      />,
    );

    const textarea = container.querySelector('va-textarea');
    expect(textarea).to.exist;
  });

  it('should display status details data', () => {
    const data = {
      dutyStatusDetails: {
        statusDetails: 'Active duty reserve training two weekends per month',
      },
    };
    const { container } = render(
      <DutyStatusDetailsPage
        goForward={mockGoForward}
        data={data}
        setFormData={mockSetFormData}
      />,
    );

    const textarea = container.querySelector('va-textarea');
    expect(textarea.getAttribute('value')).to.equal(
      'Active duty reserve training two weekends per month',
    );
  });

  it('should handle undefined data', () => {
    const { container } = render(
      <DutyStatusDetailsPage
        goForward={mockGoForward}
        data={undefined}
        setFormData={mockSetFormData}
      />,
    );

    expect(container).to.exist;
  });

  it('should validate maxLength for status details', () => {
    const { container } = render(
      <DutyStatusDetailsPage
        goForward={mockGoForward}
        data={{}}
        setFormData={mockSetFormData}
      />,
    );

    const textarea = container.querySelector('va-textarea');
    expect(textarea.getAttribute('maxlength')).to.equal('500');
  });
});
