import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import page from '../../pages/medicalGraduatingClassDetails';

const renderPage = (formData = {}) =>
  render(
    <DefinitionTester
      schema={page.schema}
      uiSchema={page.uiSchema}
      data={formData}
      definitions={{}}
    />,
  );

describe('22-0976 medical graudating class details page', () => {
  it('renders the correct input and label', () => {
    const { container } = renderPage();
    expect(
      container.querySelectorAll(
        'va-memorable-date[label="Date of graduating class"]',
      ).length,
    ).to.equal(2);
    expect(
      container.querySelectorAll(
        'va-text-input[label="Number of students that graduated"]',
      ).length,
    ).to.equal(2);
  });

  it('shows errors when no input is given', async () => {
    const { container, getByRole } = renderPage();
    getByRole('button', { name: /submit/i }).click();
    await new Promise(resolve => setTimeout(resolve, 0));
    const dateInput = container.querySelector(
      'va-memorable-date[label="Date of graduating class"]',
    );
    expect(dateInput.getAttribute('error')).to.equal('You must enter a date');
    const numberInput = container.querySelector(
      'va-text-input[label="Number of students that graduated"]',
    );
    expect(numberInput.getAttribute('error')).to.equal(
      'Enter the number of students that graduated',
    );
  });

  it('errors when the dates are the same', async () => {
    const { container, getByRole } = renderPage({
      graduatedClass1Date: '2020-01-01',
      graduatedClass1Count: '123',
      graduatedClass2Date: '2020-01-01',
      graduatedClass2Count: '123',
    });
    getByRole('button', { name: /submit/i }).click();
    await new Promise(resolve => setTimeout(resolve, 0));
    const dateInput = container.querySelector(
      'va-memorable-date[label="Date of graduating class"]',
    );
    expect(dateInput.getAttribute('error')).to.equal(
      'The dates of both graduating classes cannot be the same.',
    );
  });
});
