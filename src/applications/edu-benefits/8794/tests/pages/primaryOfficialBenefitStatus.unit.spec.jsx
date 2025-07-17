import React from 'react';
import { expect } from 'chai';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import formConfig from '../../config/form';

const mockStore = configureStore();

const mockData = {
  primaryOfficialDetails: {
    fullName: {
      first: 'John',
      last: 'Doe',
    },
  },
};

describe('Primary certifying official benefit status', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.primaryOfficialChapter.pages.primaryOfficialBenefitStatus;

  it('Renders the page with the correct number of inputs', async () => {
    const store = mockStore({ form: { data: mockData } });
    const { container, getByRole } = render(
      <Provider store={store}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
        />
        ,
      </Provider>,
    );

    expect($$('va-radio', container).length).to.equal(1);
    expect($$('va-radio-option', container).length).to.equal(2);

    fireEvent.click(getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect($$('va-radio[error]', container).length).to.equal(1);
    });
  });
  it('should render disclaimer if yes is checked', () => {
    const store = mockStore({ form: { data: mockData } });
    const { container } = render(
      <Provider store={store}>
        <DefinitionTester
          definitions={formConfig.defaultDefinitions}
          schema={schema}
          uiSchema={uiSchema}
        />
        ,
      </Provider>,
    );

    $('va-radio', container).__events.vaValueChange({
      detail: { value: 'Y' },
    });

    expect($$('va-checkbox', container).length).to.equal(1);
  });
});
