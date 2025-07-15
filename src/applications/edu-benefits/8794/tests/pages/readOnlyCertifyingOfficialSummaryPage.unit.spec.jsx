import React from 'react';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { render, fireEvent, waitFor } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../config/form';
import {
  readOnlyCertifyingOfficialSummaryPage,
  arrayBuilderOptions,
} from '../../pages';

const mockStore = configureStore([thunk]);

describe('8794 ­– Read-only certifying officials • summary page', () => {
  const { schema, uiSchema } = readOnlyCertifyingOfficialSummaryPage;

  const makeStore = (data = {}) =>
    mockStore({
      form: { data },
    });

  it('renders two Yes/No radio options', () => {
    const { container } = render(
      <Provider store={makeStore({ readOnlyCertifyingOfficials: [] })}>
        <DefinitionTester
          schema={schema}
          uiSchema={uiSchema}
          definitions={formConfig.defaultDefinitions}
        />
      </Provider>,
    );

    expect($$('va-radio-option', container).length).to.equal(2);
  });

  it('shows a validation error when no option is selected and the user clicks Continue', async () => {
    const { container, getByRole } = render(
      <Provider store={makeStore({ readOnlyCertifyingOfficials: [] })}>
        <DefinitionTester
          schema={schema}
          uiSchema={uiSchema}
          definitions={formConfig.defaultDefinitions}
        />
      </Provider>,
    );

    expect($$('va-radio-option', container).length).to.equal(2);

    fireEvent.click(getByRole('button', { name: /submit|continue/i }));

    await waitFor(() => {
      expect($$('va-radio[error]', container).length).to.equal(1);
    });
  });
  it('returns “first last” when a fullName object exists', () => {
    const item = { fullName: 'Jane Doe' };
    const name = arrayBuilderOptions.text.getItemName(item);
    expect(name).to.equal('Jane Doe');
  });

  it('is undefined when fullName is missing', () => {
    const emptyItem = {};
    const name = arrayBuilderOptions.text.getItemName(emptyItem);
    expect(name).to.be.undefined;
  });
});
