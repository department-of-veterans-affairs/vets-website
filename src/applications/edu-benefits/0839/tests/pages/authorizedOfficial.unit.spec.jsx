import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../config/form';

const { schema, uiSchema } =
  formConfig.chapters.personalInformationChapter.pages.authorizedOfficial;

const mockStore = configureStore();

describe('Authorized Official Page', () => {
  const renderPage = (formData = {}) => {
    const store = mockStore({ form: { data: formData } });
    return render(
      <Provider store={store}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
          data={formData}
        />
      </Provider>,
    );
  };

  it('renders full name input fields (no middle name)', () => {
    const { container } = renderPage();

    expect(
      $$('va-text-input[label="First or given name"]', container).length,
    ).to.equal(1);

    expect(
      $$('va-text-input[label="Last or family name"]', container).length,
    ).to.equal(1);
  });

  it('renders title input field', () => {
    const { container } = renderPage();

    expect(
      $$('va-text-input[label="Your official title"]', container).length,
    ).to.equal(1);

    // Check for hint on title input field
    expect(
      $$('va-text-input[hint^="Enter your full official"]', container).length,
    ).to.equal(1);
  });

  it('renders international phone widget', async () => {
    const { container } = renderPage();

    expect(
      $$('va-telephone-input[label="Phone number"]', container).length,
    ).to.equal(1);
  });

  it('shows errors when required fields are empty', async () => {
    const { container, getByRole } = renderPage();

    getByRole('button', { name: /submit/i }).click();

    await waitFor(() => {
      // at least 3 form errors (first name, last name, title)
      expect($$('va-text-input[error]', container).length).to.equal(3);
    });
  });
});
