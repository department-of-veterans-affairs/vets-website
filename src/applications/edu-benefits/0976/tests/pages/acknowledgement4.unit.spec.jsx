import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import page from '../../pages/acknowledgement4';

const renderPage = (formData = {}) =>
  render(
    <DefinitionTester
      schema={page.schema}
      uiSchema={page.uiSchema}
      data={formData}
      definitions={{}}
    />,
  );

describe('22-0976 acknowledgement 4 page', () => {
  it('renders page title', () => {
    const { container } = renderPage();
    expect(container.textContent).to.contain(
      'Institution Acknowledgements (4 of 5)',
    );
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
        'You must make a selection.',
      );
    });
  });

  it('shows error when "No" is selected, but no explanation is provided', async () => {
    const { container, getByRole } = renderPage({
      acknowledgement10a: { financiallySound: false },
    });

    getByRole('button', { name: /submit/i }).click();

    await waitFor(() => {
      const textInput = container.querySelector('va-textarea');

      expect(textInput.getAttribute('error')).to.equal(
        'You must specify a reason the institution is not capable of fulfilling its commitments for training.',
      );
    });
  });
});
