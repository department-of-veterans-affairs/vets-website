import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import page from '../../pages/attestation';

const renderPage = (formData = {}) =>
  render(
    <DefinitionTester
      schema={page.schema}
      uiSchema={page.uiSchema}
      data={formData}
      definitions={{}}
    />,
  );

describe('22-0989 attestation page', () => {
  it('renders name and program fields', () => {
    const { container } = renderPage();

    expect(container.textContent).to.contain(
      'Attestation of Hours Transferred',
    );
    expect(container.querySelector('va-text-input[label="Your full name"]')).to
      .exist;
    expect(container.querySelector('va-memorable-date[label="Date"]')).to.exist;
  });

  it('shows errors when required fields are empty', async () => {
    const { container, getByRole } = renderPage();
    getByRole('button', { name: /submit/i }).click();
    await waitFor(() => {
      expect(
        container.querySelectorAll('va-text-input[error]').length,
      ).to.equal(1);
      expect(
        container.querySelectorAll('va-memorable-date[error]').length,
      ).to.equal(1);
    });
  });

  it('shows an error the attestation name does not match', async () => {
    const { container, getByRole } = renderPage({
      applicantName: {
        first: 'John',
        last: 'Doe',
      },
      attestationDate: '2020-01-01',
      attestationName: 'Jane Doe',
    });

    getByRole('button', { name: /submit/i }).click();
    await waitFor(() => {
      const nameInput = container.querySelector('va-text-input');
      expect(nameInput.getAttribute('error')).to.equal(
        'Enter your name exactly as it appears on your form: John Doe',
      );
    });
  });
});
