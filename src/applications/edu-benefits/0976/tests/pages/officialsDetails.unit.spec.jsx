import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import page from '../../pages/officialsDetails';

const renderPage = (formData = {}) =>
  render(
    <DefinitionTester
      schema={page.schema}
      uiSchema={page.uiSchema}
      data={formData}
      definitions={{}}
    />,
  );

describe('22-0976 officials details page', () => {
  it('renders name and title fields', () => {
    const { container } = renderPage();

    expect(
      container.querySelector('va-text-input[label="First or given name"]'),
    ).to.exist;
    expect(
      container.querySelector('va-text-input[label="Last or family name"]'),
    ).to.exist;
    expect(container.querySelector('va-text-input[label="Title"]')).to.exist;
  });

  it('shows errors when required fields are empty', async () => {
    const { container, getByRole } = renderPage();

    getByRole('button', { name: /submit/i }).click();

    await waitFor(() => {
      expect(
        container.querySelectorAll('va-text-input[error]').length,
      ).to.equal(3);
    });
  });
});
