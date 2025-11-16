import React from 'react';
import { expect } from 'chai';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.associatedOfficialsChapter.pages.schoolCertifyingOfficialNew;

const mockStore = configureStore();

describe('New Commitment Chapter = School Certifying Official Page', () => {
  const renderPage = (
    formData = {
      newCommitment: {
        schoolCertifyingOfficial: {},
      },
    },
  ) => {
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

  it('renders full name input fields', () => {
    const { container } = renderPage();

    expect(
      $$('va-text-input[label="First or given name"]', container).length,
    ).to.equal(1);

    expect($$('va-text-input[label="Middle name"]', container).length).to.equal(
      1,
    );

    expect(
      $$('va-text-input[label="Last or family name"]', container).length,
    ).to.equal(1);
  });

  it('renders title input field', () => {
    const { container } = renderPage();

    expect($$('va-text-input[label="Title"]', container).length).to.equal(1);
  });

  it('renders phone type select radio buttons', async () => {
    const { container } = renderPage();

    expect(
      $$('va-radio[label^="Select a type of phone number"]', container).length,
    ).to.equal(1);
  });

  it('renders us and international phone number input fields', async () => {
    const { container } = renderPage();

    expect(
      $$('va-text-input[label="US phone number"]', container).length,
    ).to.equal(1);
    // Check for hint on US phone number input field
    expect(
      $$('va-text-input[hint^="Enter a 10-digit phone number"]', container)
        .length,
    ).to.equal(1);

    expect(
      $$('va-text-input[label="International phone number"]', container).length,
    ).to.equal(1);
    // Check for hint on International phone number input field
    expect(
      $$('va-text-input[hint^="For non-US phone numbers"]', container).length,
    ).to.equal(1);
  });

  it('renders email input field', () => {
    const { container } = renderPage();

    expect(
      $$('va-text-input[label="Email address"]', container).length,
    ).to.equal(1);
  });

  it('shows errors when required fields are empty', async () => {
    const { container, getByRole } = renderPage();

    getByRole('button', { name: /submit/i }).click();

    await waitFor(() => {
      // at least 4 input form errors (first name, last name, title, emai)
      expect($$('va-text-input[error]', container).length).to.equal(4);

      // at least 1 radio form errors (phone type)
      expect($$('va-radio[error]', container).length).to.equal(1);
    });
  });

  it('updates the required input/number after selecting a phone type', async () => {
    const { container, getByRole } = renderPage();

    fireEvent.click(getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect($$('va-text-input[error]', container).length).to.equal(4);
    });

    $('va-radio', container).__events.vaValueChange({
      detail: { value: 'us' },
    });

    expect($$('va-text-input[error]', container).length).to.equal(5);

    $('va-radio', container).__events.vaValueChange({
      detail: { value: 'intl' },
    });

    expect($$('va-text-input[error]', container).length).to.equal(5);
  });
});
