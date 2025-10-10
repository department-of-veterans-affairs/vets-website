import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import * as page from '../../pages/acknowledgements';

const mockStore = configureStore([]);

describe('Acknowledgements Page', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      form: {
        data: {
          authorizedOfficial: {
            fullName: {
              first: 'John',
              last: 'Doe',
            },
          },
        },
      },
    });
  });

  const renderPage = (formData = {}) => {
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

  it('renders page title', () => {
    const { container } = renderPage();
    expect(container.textContent).to.contain(
      'Initial each statement to acknowledge the Yellow Ribbon Program terms',
    );
  });

  it('renders additional instructions link', () => {
    const { container } = renderPage();
    const link = container.querySelector('va-link');
    expect(link).to.exist;
    expect(link.getAttribute('text')).to.contain(
      'Review additional instructions for the Yellow Ribbon Program Agreement',
    );
    expect(link.getAttribute('href')).to.contain('yellow-ribbon-instructions');
  });

  it('renders all four statement descriptions', () => {
    const { container } = renderPage();

    expect(container.textContent).to.contain(
      'For all U.S. schools, once this agreement is accepted by VA',
    );

    expect(container.textContent).to.contain(
      'The IHL agrees to provide contributions to eligible individuals',
    );

    expect(container.textContent).to.contain(
      'The IHL agrees to provide contributions on behalf of a participating individual',
    );

    expect(container.textContent).to.contain(
      'The IHL agrees to provide the maximum amount of contributions payable',
    );
  });

  it('renders all four initial input fields with CapitalizedTextInputField component', () => {
    const { container } = renderPage();

    const inputs = $$('va-text-input[label="Initial here"]', container);
    expect(inputs.length).to.equal(4);
  });

  it('shows errors when required fields are empty on submit', async () => {
    const { container, getByRole } = renderPage();

    getByRole('button', { name: /submit/i }).click();

    await waitFor(() => {
      const textInputErrors = $$('va-text-input[error]', container);
      const checkboxErrors = $$('va-checkbox[error]', container);

      expect(textInputErrors.length).to.equal(4);
      expect(checkboxErrors.length).to.equal(1);
    });
  });

  it('shows custom error message for checkbox when not checked', async () => {
    const { container, getByRole } = renderPage({
      statement1Initial: 'JD',
      statement2Initial: 'JD',
      statement3Initial: 'JD',
      statement4Initial: 'JD',
    });

    getByRole('button', { name: /submit/i }).click();

    await waitFor(() => {
      const checkbox = container.querySelector('va-checkbox');
      expect(checkbox.getAttribute('error')).to.equal(
        'You must agree to provide Yellow Ribbon Program contributions',
      );
    });
  });
});
