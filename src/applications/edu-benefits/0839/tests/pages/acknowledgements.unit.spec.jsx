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
  describe('validateInitialsMatch', () => {
    let errors;
    let validationFn;

    beforeEach(() => {
      errors = {
        errorMessages: [],
        addError(message) {
          this.errorMessages.push(message);
        },
      };
      // eslint-disable-next-line prefer-destructuring
      validationFn = page.uiSchema.statement1Initial['ui:validations'][0];
    });

    it('capitalizes fieldData before validation', () => {
      const fieldData = 'jd';
      const formData = {
        authorizedOfficial: {
          fullName: {
            first: 'John',
            last: 'Doe',
          },
        },
      };

      validationFn(errors, fieldData, formData);

      expect(errors.errorMessages).to.have.lengthOf(0);
    });

    it('does not add error when fieldData is empty', () => {
      const fieldData = '';
      const formData = {
        authorizedOfficial: {
          fullName: {
            first: 'John',
            last: 'Doe',
          },
        },
      };

      validationFn(errors, fieldData, formData);

      expect(errors.errorMessages).to.have.lengthOf(0);
    });
    it('adds error when fieldData contains non-letter characters', () => {
      const fieldData = 'J1';
      const formData = {
        authorizedOfficial: {
          fullName: {
            first: 'John',
            last: 'Doe',
          },
        },
      };

      validationFn(errors, fieldData, formData);

      expect(errors.errorMessages).to.have.lengthOf(1);
      expect(errors.errorMessages[0]).to.equal(
        'Please enter your initials using letters only',
      );
    });

    it('handles missing firstName gracefully', () => {
      const fieldData = 'JD';
      const formData = {
        authorizedOfficial: {
          fullName: {
            last: 'Doe',
          },
        },
      };

      validationFn(errors, fieldData, formData);

      expect(errors.errorMessages).to.have.lengthOf(1);
      expect(errors.errorMessages[0]).to.contain(
        'Initials must match your name',
      );
    });

    it('handles missing lastName gracefully', () => {
      const fieldData = 'JD';
      const formData = {
        authorizedOfficial: {
          fullName: {
            first: 'John',
          },
        },
      };

      validationFn(errors, fieldData, formData);

      expect(errors.errorMessages).to.have.lengthOf(1);
      expect(errors.errorMessages[0]).to.contain(
        'Initials must match your name',
      );
    });
    it('handles hyphenated last names correctly', () => {
      const fieldData = 'JSJ';
      const formData = {
        authorizedOfficial: {
          fullName: {
            first: 'John',
            last: 'Smith-Jones',
          },
        },
      };

      validationFn(errors, fieldData, formData);

      expect(errors.errorMessages).to.have.lengthOf(0);
    });

    it('adds error when third initial does not match hyphenated last name', () => {
      const fieldData = 'JSA';
      const formData = {
        authorizedOfficial: {
          fullName: {
            first: 'John',
            last: 'Smith-Jones',
          },
        },
      };

      validationFn(errors, fieldData, formData);

      expect(errors.errorMessages).to.have.lengthOf(1);
      expect(errors.errorMessages[0]).to.contain(
        'Initials must match your name: John Smith-Jones',
      );
    });

    it('does not add error when only 2 initials provided for hyphenated last name', () => {
      const fieldData = 'JS';
      const formData = {
        authorizedOfficial: {
          fullName: {
            first: 'John',
            last: 'Smith-Jones',
          },
        },
      };

      validationFn(errors, fieldData, formData);

      expect(errors.errorMessages).to.have.lengthOf(0);
    });

    it('adds error when first initial does not match', () => {
      const fieldData = 'AD';
      const formData = {
        authorizedOfficial: {
          fullName: {
            first: 'John',
            last: 'Doe',
          },
        },
      };

      validationFn(errors, fieldData, formData);

      expect(errors.errorMessages).to.have.lengthOf(1);
      expect(errors.errorMessages[0]).to.contain(
        'Initials must match your name: John Doe',
      );
    });

    it('adds error when last initial does not match', () => {
      const fieldData = 'JA';
      const formData = {
        authorizedOfficial: {
          fullName: {
            first: 'John',
            last: 'Doe',
          },
        },
      };

      validationFn(errors, fieldData, formData);

      expect(errors.errorMessages).to.have.lengthOf(1);
      expect(errors.errorMessages[0]).to.contain(
        'Initials must match your name: John Doe',
      );
    });
  });
});
