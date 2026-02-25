import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import page from '../../pages/oldSchoolNameAndAddress';

const renderPage = (formData = {}) =>
  render(
    <DefinitionTester
      schema={page.schema}
      uiSchema={page.uiSchema}
      data={formData}
      definitions={{}}
    />,
  );

describe('22-0989 old school name and mailing address page', () => {
  it('renders name and address fields', () => {
    const { container } = renderPage();
    expect(container.querySelector('va-text-input[label="School name"]')).to
      .exist;
    expect(container.querySelector('va-select[label="Country"]')).to.exist;
    expect(container.querySelector('va-text-input[label="Street address"]')).to
      .exist;
    expect(
      container.querySelector('va-text-input[label="Street address line 2"]'),
    ).to.exist;
    expect(
      container.querySelector('va-text-input[label="Street address line 3"]'),
    ).to.exist;
    expect(container.querySelector('va-text-input[label="City"]')).to.exist;
    expect(
      container.querySelector(
        'va-text-input[label="State, province, or region"]',
      ),
    ).to.exist;
    expect(container.querySelector('va-text-input[label="Postal code"]')).to
      .exist;
  });

  it('shows errors when required fields are empty', async () => {
    const { container, getByRole } = renderPage();
    getByRole('button', { name: /submit/i }).click();
    await waitFor(() => {
      // 3 address-line errors (street, city, postalCode) and the school name
      expect(
        container.querySelectorAll('va-text-input[error]').length,
      ).to.equal(4);
    });
  });
});
