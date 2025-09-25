import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import { inputVaTextInput } from 'platform/testing/unit/helpers';
import * as page from '../../pages/acknowledgements';

const mockStore = configureStore();

const renderPage = (formData = {}) => {
  const store = mockStore({
    form: {
      data: formData,
    },
  });

  return render(
    <Provider store={store}>
      <DefinitionTester
        schema={page.schema}
        uiSchema={page.uiSchema}
        formData={formData}
        definitions={{}}
      />
    </Provider>,
  );
};

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

    // Verify the content of each statement is present (matching actual uiSchema descriptions)
    expect(container.textContent).to.include(
      'once this agreement is accepted by VA, it will be considered an open-ended agreement',
    );
    expect(container.textContent).to.include(
      'The IHL agrees to provide contributions to eligible individuals who apply for such program at the institution',
    );
    expect(container.textContent).to.include(
      'The IHL agrees to provide contributions on behalf of a participating individual during the current academic year',
    );
    expect(container.textContent).to.include(
      'The IHL agrees to provide the maximum amount of contributions payable toward the net cost',
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
      statement1Initial: 'AB',
      statement2Initial: 'CD',
      statement3Initial: 'EFG',
      statement4Initial: 'HI',
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

  it('validates initial field pattern (2-3 letters only)', async () => {
    const { container, getByRole } = renderPage({
      statement1Initial: '123', // Invalid: numbers
      statement2Initial: 'AB', // Valid: 2 letters
      statement3Initial: 'ABCD', // Invalid: too long
      statement4Initial: 'A', // Invalid: too short (1 letter)
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
        'You must agree to provide Yellow Ribbon Program contributions',
      );
    });
  });

  it('accepts valid initials with different lengths', () => {
    const { container, unmount } = renderPage({
      statement1Initial: 'AB', // 2 characters
      statement2Initial: 'CD', // 2 characters
      statement3Initial: 'EFG', // 3 characters
      statement4Initial: 'HI', // 2 characters
      agreementCheckbox: true,
    });

    expect(container.querySelectorAll('[error]')).to.have.length(0);
    unmount();
  });

  it('accepts both uppercase and lowercase letters in initials', () => {
    const { container, unmount } = renderPage({
      statement1Initial: 'ab', // lowercase
      statement2Initial: 'Def', // mixed case
      statement3Initial: 'GHI', // uppercase
      statement4Initial: 'jk', // lowercase
      agreementCheckbox: true,
    });

    expect(container.querySelectorAll('[error]')).to.have.length(0);
    unmount();
  });

  it('enforces matching initials across all statement fields (case-insensitive)', async () => {
    const { container, getByRole } = renderPage();

    inputVaTextInput(
      container,
      'ab',
      'va-text-input[name="root_statement1Initial"]',
    );
    inputVaTextInput(
      container,
      'AC',
      'va-text-input[name="root_statement2Initial"]',
    );
    inputVaTextInput(
      container,
      'Ad',
      'va-text-input[name="root_statement3Initial"]',
    );
    inputVaTextInput(
      container,
      'AE',
      'va-text-input[name="root_statement4Initial"]',
    );

    const checkbox = container.querySelector('va-checkbox');
    checkbox.dispatchEvent(
      new CustomEvent('vaChange', { detail: { checked: true }, bubbles: true }),
    );

    getByRole('button', { name: /submit/i }).click();

    await waitFor(() => {
      const mismatchErrors = $$(
        'va-text-input[error="Initials must match across all statements"]',
        container,
      );
      expect(mismatchErrors.length).to.equal(3);
    });
  });

  it('allows submission when all initials match statement1', async () => {
    const { container, getByRole } = renderPage();

    inputVaTextInput(
      container,
      'AB',
      'va-text-input[name="root_statement1Initial"]',
    );
    inputVaTextInput(
      container,
      'AB',
      'va-text-input[name="root_statement2Initial"]',
    );
    inputVaTextInput(
      container,
      'AB',
      'va-text-input[name="root_statement3Initial"]',
    );
    inputVaTextInput(
      container,
      'AB',
      'va-text-input[name="root_statement4Initial"]',
    );

    const checkbox = container.querySelector('va-checkbox');
    checkbox.dispatchEvent(
      new CustomEvent('vaChange', { detail: { checked: true }, bubbles: true }),
    );

    getByRole('button', { name: /submit/i }).click();

    await waitFor(() => {
      expect($$('va-text-input[error]', container).length).to.equal(0);
    });
  });
});
