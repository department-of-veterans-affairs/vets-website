import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import * as page from '../../pages/TestNameAndDate';

const renderPage = (formData = {}) =>
  render(
    <DefinitionTester
      schema={page.schema}
      uiSchema={page.uiSchema}
      data={formData}
      definitions={{}}
    />,
  );

describe('22-0803 test name and date page', () => {
  it('renders the correct inputs and labels', () => {
    const { container } = renderPage();
    expect(container.querySelector('va-text-input[label="Name of test"]')).to
      .exist;
    expect(
      container.querySelector('va-memorable-date[label="Date test was taken"]'),
    ).to.exist;
  });

  it('shows errors with no input', async () => {
    const { container, getByRole } = renderPage();
    getByRole('button', { name: /submit/i }).click();
    await new Promise(resolve => setTimeout(resolve, 0));
    const nameInput = container.querySelector(
      'va-text-input[label="Name of test"]',
    );
    expect(nameInput.getAttribute('error')).to.equal(
      'Enter the name of the test',
    );
    const dateInput = container.querySelector(
      'va-memorable-date[label="Date test was taken"]',
    );
    expect(dateInput.getAttribute('error')).to.equal(
      'Enter the date you took the test',
    );
  });

  it('shows error when a future date is given ', async () => {
    const nextWeek = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    const { container, getByRole } = renderPage({ testDate: nextWeek });
    getByRole('button', { name: /submit/i }).click();
    await new Promise(resolve => setTimeout(resolve, 0));
    const dateInput = container.querySelector(
      'va-memorable-date[label="Date test was taken"]',
    );
    expect(dateInput.getAttribute('error')).to.equal(
      'You must enter a past or present date',
    );
  });
});
