import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import page from '../../pages/primaryInstitutionTitle4';

const renderPage = (formData = {}) =>
  render(
    <DefinitionTester
      schema={page.schema}
      uiSchema={page.uiSchema}
      data={formData}
      definitions={{}}
    />,
  );

describe('22-0976 institution title 4 page', () => {
  it('renders page title', () => {
    const { container } = renderPage();
    expect(container.textContent).to.contain('Institution details');
  });

  it('renders the input field', () => {
    const { container } = renderPage();

    expect(container.querySelector('va-radio')).to.exist;
  });

  it('shows error when no option is selected', async () => {
    const { container, getByRole } = renderPage();
    getByRole('button', { name: /submit/i }).click();

    await waitFor(() => {
      const radioInput = container.querySelector('va-radio');

      expect(radioInput.getAttribute('error')).to.equal(
        'You must provide a response',
      );
    });
  });

  it('shows error when "No" is selected, but no detail is provided', async () => {
    const { container, getByRole } = renderPage({
      institutionProfile: { participatesInTitleIV: true },
    });

    getByRole('button', { name: /submit/i }).click();

    await waitFor(() => {
      const textInput = container.querySelector('va-text-input');

      expect(textInput.getAttribute('error')).to.equal(
        'You must enter your institution’s OPEID number below',
      );
    });
  });
});
