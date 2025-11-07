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
    const checkboxes = container.querySelectorAll('va-checkbox');

    expect(dateFields.length).to.be.at.least(1); // beginningDate (endingDate is conditional)
    expect(checkboxes.length).to.be.at.least(1); // currentlyEmployed
  });

  it('should display checkbox for currently employed', () => {
    const data = {
      employmentDates: {
        currentlyEmployed: true,
      },
    };
    const { container } = render(
      <EmploymentDatesPage
        goForward={mockGoForward}
        data={data}
        setFormData={mockSetFormData}
      />,
    );

    const checkbox = container.querySelector('va-checkbox');
    expect(checkbox).to.exist;
    expect(checkbox.hasAttribute('checked')).to.be.true;
  });

  it('should show ending date field when not currently employed', () => {
    const data = {
      employmentDates: {
        currentlyEmployed: false,
      },
    };
    const { container } = render(
      <EmploymentDatesPage
        goForward={mockGoForward}
        data={data}
        setFormData={mockSetFormData}
      />,
    );

    const dateFields = container.querySelectorAll('va-memorable-date');
    expect(dateFields.length).to.equal(2); // beginningDate and endingDate
  });

  it('should hide ending date field when currently employed', () => {
    const data = {
      employmentDates: {
        currentlyEmployed: true,
      },
    };
    const { container } = render(
      <EmploymentDatesPage
        goForward={mockGoForward}
        data={data}
        setFormData={mockSetFormData}
      />,
    );

    const dateFields = container.querySelectorAll('va-memorable-date');
    expect(dateFields.length).to.equal(1); // only beginningDate
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

  it('should use veteran and employer names in title and labels', () => {
    const data = {
      veteranInformation: {
        firstName: 'Boba',
        lastName: 'Fett',
      },
      employerInformation: {
        employerName: 'Bounty Hunters Guild',
      },
      employmentDates: {
        currentlyEmployed: false,
      },
    };
    const { container } = render(
      <EmploymentDatesPage
        goForward={mockGoForward}
        data={data}
        setFormData={mockSetFormData}
      />,
    );

    // Check title includes veteran name
    const text = container.textContent;
    expect(text).to.include('Boba Fett');

    // Check that the memorable date fields have labels with names
    const dateFields = container.querySelectorAll('va-memorable-date');
    expect(dateFields.length).to.equal(2);

    const beginningLabel = dateFields[0].getAttribute('label');
    expect(beginningLabel).to.include('Boba Fett');
    expect(beginningLabel).to.include('Bounty Hunters Guild');
    expect(beginningLabel).to.include('start working');

    const endingLabel = dateFields[1].getAttribute('label');
    expect(endingLabel).to.include('Boba Fett');
    expect(endingLabel).to.include('Bounty Hunters Guild');
    expect(endingLabel).to.include('stop working');
  });
});
