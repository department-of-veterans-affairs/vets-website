import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import page from '../../pages/programInformationDetails';

const renderPage = (formData = {}) =>
  render(
    <DefinitionTester
      schema={page.schema}
      uiSchema={page.uiSchema}
      data={formData}
      definitions={{}}
    />,
  );

describe('22-0976 program information details page', () => {
  it('renders name and details fields', () => {
    const { container } = renderPage();

    expect(
      container.querySelector('va-text-input[label="Name of degree program"]'),
    ).to.exist;
    expect(
      container.querySelector('va-text-input[label="Total length of program"]'),
    ).to.exist;
    expect(
      container.querySelector(
        'va-text-input[label="Number of weeks per term/semester"]',
      ),
    ).to.exist;
    expect(container.querySelector('va-text-input[label="Entry requirements"]'))
      .to.exist;
    expect(container.querySelector('va-text-input[label="Credit hours"]')).to
      .exist;
  });

  it('shows errors when required fields are empty', async () => {
    const { container, getByRole } = renderPage();

    getByRole('button', { name: /submit/i }).click();

    await waitFor(() => {
      expect(
        container.querySelectorAll('va-text-input[error]').length,
      ).to.equal(5);
    });
  });
});
