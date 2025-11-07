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

  it('should render textarea and radio fields', () => {
    const { container } = render(
      <DutyStatusDetailsPage
        goForward={mockGoForward}
        data={{}}
        setFormData={mockSetFormData}
      />,
    );

    const textarea = container.querySelector('va-textarea');
    const radio = container.querySelector('va-radio');
    expect(textarea).to.exist;
    expect(radio).to.exist;
  });

  it('should display current duty status data', () => {
    const data = {
      dutyStatusDetails: {
        currentDutyStatus:
          'Active duty reserve training two weekends per month',
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

  it('should display disabilities prevent duties data', () => {
    const data = {
      dutyStatusDetails: {
        disabilitiesPreventDuties: 'yes',
      },
    };
    const { container } = render(
      <DutyStatusDetailsPage
        goForward={mockGoForward}
        data={data}
        setFormData={mockSetFormData}
      />,
    );

    const radio = container.querySelector('va-radio');
    expect(radio.getAttribute('value')).to.equal('yes');
  });

  it('should use veteran name in labels', () => {
    const data = {
      veteranInformation: {
        firstName: 'Boba',
        lastName: 'Fett',
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
    const radio = container.querySelector('va-radio');
    expect(textarea.getAttribute('label')).to.include('Boba Fett');
    expect(radio.getAttribute('label')).to.include('Boba Fett');
  });

  it('should use "the Veteran" when no name provided', () => {
    const { container } = render(
      <DutyStatusDetailsPage
        goForward={mockGoForward}
        data={{}}
        setFormData={mockSetFormData}
      />,
    );

    const textarea = container.querySelector('va-textarea');
    const radio = container.querySelector('va-radio');
    expect(textarea.getAttribute('label')).to.include('the Veteran');
    expect(radio.getAttribute('label')).to.include('the Veteran');
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

  it('should validate maxLength for current duty status', () => {
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
