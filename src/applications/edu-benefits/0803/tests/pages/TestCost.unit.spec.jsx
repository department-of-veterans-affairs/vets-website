import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import * as page from '../../pages/TestCost';

const renderPage = (formData = {}) =>
  render(
    <DefinitionTester
      schema={page.schema}
      uiSchema={page.uiSchema}
      data={formData}
      definitions={{}}
    />,
  );

describe('22-0803 test cost page', () => {
  it('renders the correct input and label', () => {
    const { container } = renderPage();
    expect(container.querySelector('va-text-input[label="Total test cost"]')).to
      .exist;
  });

  it('shows errors with no input', async () => {
    const { container, getByRole } = renderPage();
    getByRole('button', { name: /submit/i }).click();
    await new Promise(resolve => setTimeout(resolve, 0));
    const input = container.querySelector(
      'va-text-input[label="Total test cost"]',
    );
    expect(input.getAttribute('error')).to.equal(
      'Enter the total cost of the test',
    );
  });

  it('shows error when a poorly formatted input is given', async () => {
    const { container, getByRole } = renderPage({ testCost: 'abc' });
    getByRole('button', { name: /submit/i }).click();
    await new Promise(resolve => setTimeout(resolve, 0));
    const input = container.querySelector(
      'va-text-input[label="Total test cost"]',
    );
    expect(input.getAttribute('error')).to.equal('Enter a valid dollar amount');
  });
});
