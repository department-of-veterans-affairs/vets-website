import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import * as page from '../../pages/acknowledgements';

const renderPage = (formData = {}) =>
  render(
    <DefinitionTester
      schema={page.schema}
      uiSchema={page.uiSchema}
      formData={formData}
      definitions={{}}
    />,
  );

describe('22-0839 acknowledgements page', () => {
  it('renders the external link to additional instructions', () => {
    const { container } = renderPage();
    const link = container.querySelector('va-link');
    expect(link).to.exist;
    expect(link.getAttribute('text')).to.equal(
      'Review additional instructions for the Yellow Ribbon Program Agreement ',
    );
    expect(link.getAttribute('href')).to.equal(
      '/school-administrators/submit-yellow-ribbon-program-agreement-form-22-0839/yellow-ribbon-instructions',
    );
  });

  it('renders all four statement descriptions', () => {
    const { container } = renderPage();

    // Check that all four statement descriptions are present
    const statements = container.querySelectorAll(
      '[class*="vads-u-margin-bottom"]',
    );
    expect(statements.length).to.be.greaterThan(0);

    // Verify the content of each statement is present
    expect(container.textContent).to.include(
      'The Institution of Higher Learning (IHL) agrees that this Yellow Ribbon Program agreement is open-ended',
    );
    expect(container.textContent).to.include(
      'The IHL agrees to provide contributions to eligible individuals on a first-come-first-serve basis',
    );
    expect(container.textContent).to.include(
      'The IHL agrees to provide contributions for participating individuals during the current academic year',
    );
    expect(container.textContent).to.include(
      'The IHL agrees that the maximum amount of contributions payable toward the net cost',
    );
  });

  it('renders all four initial input fields with correct labels', () => {
    const { container } = renderPage();

    const initialFields = $$('va-text-input[label="Initial here"]', container);
    expect(initialFields.length).to.equal(4);

    // Check that all fields have the correct attributes
    initialFields.forEach(field => {
      expect(field.getAttribute('label')).to.equal('Initial here');
      expect(field.getAttribute('width')).to.equal('small');
    });
  });

  it('renders the agreement checkbox with correct label', () => {
    const { container } = renderPage();

    const checkbox = container.querySelector('va-checkbox');
    expect(checkbox).to.exist;
    expect(checkbox.getAttribute('label')).to.equal(
      'Our school agrees to provide Yellow Ribbon Program contributions',
    );
  });

  it('accepts valid form data without errors', () => {
    const { container, unmount } = renderPage({
      statement1Initial: 'ABC',
      statement2Initial: 'DEF',
      statement3Initial: 'GHI',
      statement4Initial: 'JKL',
      agreementCheckbox: true,
    });

    expect(container.querySelectorAll('[error]')).to.have.length(0);
    unmount();
  });

  it('shows errors when required fields are empty on submit', async () => {
    const { container, getByRole } = renderPage();

    getByRole('button', { name: /submit/i }).click();

    await waitFor(() => {
      expect($$('va-text-input[error]', container).length).to.equal(4);
      expect($$('va-checkbox[error]', container).length).to.equal(1);
    });
  });

  it('validates initial field pattern (1-3 letters only)', async () => {
    const { container, getByRole } = renderPage({
      statement1Initial: '123', // Invalid: numbers
      statement2Initial: 'AB', // Valid: 2 letters
      statement3Initial: 'ABCD', // Invalid: too long
      statement4Initial: 'A', // Valid: 1 letter
      agreementCheckbox: true,
    });

    getByRole('button', { name: /submit/i }).click();

    await waitFor(() => {
      const errorFields = $$('va-text-input[error]', container);
      expect(errorFields.length).to.be.greaterThan(0);
    });
  });

  it('validates initial field max length (3 characters)', async () => {
    const { container, getByRole } = renderPage({
      statement1Initial: 'ABCD', // Invalid: too long
      statement2Initial: 'AB', // Valid
      statement3Initial: 'ABC', // Valid
      statement4Initial: 'A', // Valid
      agreementCheckbox: true,
    });

    getByRole('button', { name: /submit/i }).click();

    await waitFor(() => {
      const errorFields = $$('va-text-input[error]', container);
      expect(errorFields.length).to.be.greaterThan(0);
    });
  });

  it('shows correct error messages for required fields', async () => {
    const { container, getByRole } = renderPage();

    getByRole('button', { name: /submit/i }).click();

    await waitFor(() => {
      const initialFields = $$('va-text-input[error]', container);
      initialFields.forEach(field => {
        expect(field.getAttribute('error')).to.equal(
          'Please enter your initials',
        );
      });

      const checkbox = container.querySelector('va-checkbox[error]');
      expect(checkbox.getAttribute('error')).to.equal(
        'Please check the box to agree to provide Yellow Ribbon Program contributions',
      );
    });
  });

  it('accepts valid initials with different lengths', () => {
    const { container, unmount } = renderPage({
      statement1Initial: 'A', // 1 character
      statement2Initial: 'AB', // 2 characters
      statement3Initial: 'ABC', // 3 characters
      statement4Initial: 'X', // 1 character
      agreementCheckbox: true,
    });

    expect(container.querySelectorAll('[error]')).to.have.length(0);
    unmount();
  });

  it('accepts both uppercase and lowercase letters in initials', () => {
    const { container, unmount } = renderPage({
      statement1Initial: 'abc', // lowercase
      statement2Initial: 'Def', // mixed case
      statement3Initial: 'GHI', // uppercase
      statement4Initial: 'j', // lowercase
      agreementCheckbox: true,
    });

    expect(container.querySelectorAll('[error]')).to.have.length(0);
    unmount();
  });
});
