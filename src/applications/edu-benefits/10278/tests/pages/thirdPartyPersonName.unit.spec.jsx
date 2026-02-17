import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import formConfig from '../../config/form';

describe('Authorizing official page', () => {
  const { schema, uiSchema } =
    formConfig.chapters.thirdPartyContactInformation.pages.thirdPartyPersonName;

  const mockStore = configureStore();

  it('Renders the page with the correct number of inputs', async () => {
    const renderPage = (formData = { thirdPartyPersonName: {} }) => {
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

    expect($$('va-text-input', container).length).to.equal(3);

    fireEvent.click(getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect($$('va-text-input[error]', container).length).to.equal(2);
    });
  });
});
