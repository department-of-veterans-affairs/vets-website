import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import page from '../../pages/medicalAuthorityName';

const renderPage = (formData = {}) =>
  render(
    <DefinitionTester
      schema={page.schema}
      uiSchema={page.uiSchema}
      data={formData}
      definitions={{}}
    />,
  );

describe('22-0976 medical authority name page', () => {
  it('renders the correct input and label', () => {
    const { container } = renderPage();
    expect(
      container.querySelector(
        'va-text-input[label="Accrediting authority name"]',
      ),
    ).to.exist;
  });

  it('shows errors when no name is given', async () => {
    const { container, getByRole } = renderPage();
    getByRole('button', { name: /submit/i }).click();
    await new Promise(resolve => setTimeout(resolve, 0));
    const firstNameInput = container.querySelector(
      'va-text-input[label="Accrediting authority name"]',
    );
    expect(firstNameInput.getAttribute('error')).to.equal(
      'Enter the name of the accrediting authority.',
    );
  });
});
