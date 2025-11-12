import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$, $ } from 'platform/forms-system/src/js/utilities/ui';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import formConfig from '../../config/form';

describe('Authorizing official page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.authorizedOfficialChapter.pages.authorizedOfficial;

  const mockStore = configureStore();

  it('Renders the page with the correct number of inputs', async () => {
    const renderPage = (formData = { authorizedOfficial: {} }) => {
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

    const { container, getByRole } = renderPage();

    expect($$('va-text-input', container).length).to.equal(6);
    expect($$('va-radio', container).length).to.equal(1);
    expect($$('va-radio-option', container).length).to.equal(2);

    fireEvent.click(getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect($$('va-text-input[error]', container).length).to.equal(3);
    });
  });
  it('Renders the page with the correct number of required inputs after selecting a phone type', async () => {
    const renderPage = (formData = { authorizedOfficial: {} }) => {
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

    const { container, getByRole } = renderPage();

    fireEvent.click(getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect($$('va-text-input[error]', container).length).to.equal(3);
    });

    $('va-radio', container).__events.vaValueChange({
      detail: { value: 'us' },
    });

    expect($$('va-text-input[error]', container).length).to.equal(4);

    $('va-radio', container).__events.vaValueChange({
      detail: { value: 'intl' },
    });

    expect($$('va-text-input[error]', container).length).to.equal(4);
  });
});
