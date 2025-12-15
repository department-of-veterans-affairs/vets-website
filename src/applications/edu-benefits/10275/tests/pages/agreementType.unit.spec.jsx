import React from 'react';
import { expect } from 'chai';
import { render, waitFor, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.agreementTypeChapter.pages.agreementType;

const mockStore = configureStore();

describe('Agreement Type Gate', () => {
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

  it('renders a radio group with two options and the field description', () => {
    const { container } = renderPage();

    expect($$('va-radio', container).length).to.equal(1);
    expect($$('va-radio-option', container).length).to.equal(2);

    const fieldset = container.querySelector('fieldset');
    expect(fieldset).to.exist;

    const scoped = within(fieldset);

    scoped.getByText(/update a previously submitted commitment/i);

    scoped.getByText(/withdrawal of commitment/i);
    scoped.getByText(
      /you only need to enter your facility code and authorizing official/i,
    );
  });

  it('shows a required error when no option is selected and Submit is pressed', async () => {
    const { container, getByRole } = renderPage();

    getByRole('button', { name: /submit/i }).click();

    await waitFor(() => {
      expect($$('va-radio[error]', container).length).to.equal(1);
    });
  });

  it('clears the error after selecting "New commitment" and submitting', async () => {
    const { container, getByRole } = renderPage();

    $('va-radio', container).__events.vaValueChange({
      detail: { value: 'newCommitment' },
    });
    getByRole('button', { name: /submit/i }).click();

    await waitFor(() => {
      expect($$('va-radio[error]', container).length).to.equal(0);
    });
  });

  it('accepts "Withdrawal of commitment" selection without showing an error', async () => {
    const { container, getByRole } = renderPage();

    $('va-radio', container).__events.vaValueChange({
      detail: { value: 'withdrawal' },
    });

    getByRole('button', { name: /submit/i }).click();

    await waitFor(() => {
      expect($$('va-radio[error]', container).length).to.equal(0);
    });
  });
});
