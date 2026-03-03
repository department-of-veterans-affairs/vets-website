import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import page from '../../pages/institutionFinancialRepresentative';

const renderPage = (formData = {}) =>
  render(
    <DefinitionTester
      schema={page.schema}
      uiSchema={page.uiSchema}
      data={formData}
      definitions={{}}
    />,
  );

describe('22-0976 financial representative page', () => {
  it('renders the correct inputs and labels', () => {
    const { container } = renderPage();
    expect(
      container.querySelector('va-text-input[label="First or given name"]'),
    ).to.exist;
    expect(
      container.querySelector('va-text-input[label="Last or family name"]'),
    ).to.exist;
    expect(container.querySelector('va-text-input[label="Email address"]')).to
      .exist;
  });

  it('shows errors when no name is given', async () => {
    const { container, getByRole } = renderPage();
    getByRole('button', { name: /submit/i }).click();
    await new Promise(resolve => setTimeout(resolve, 0));
    const firstNameInput = container.querySelector(
      'va-text-input[label="First or given name"]',
    );
    expect(firstNameInput.getAttribute('error')).to.equal(
      'Enter a first or given name',
    );
    const lastNameInput = container.querySelector(
      'va-text-input[label="Last or family name"]',
    );
    expect(lastNameInput.getAttribute('error')).to.equal(
      'Enter a last or family name',
    );
  });
});
