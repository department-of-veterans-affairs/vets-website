import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import formConfig from '../../config/form';

const mockStore = configureStore([]);

describe('22-8894 – Institution Name & Address Page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.institutionDetailsChapter.pages.institutionNameAndAddress;
  function renderPage(data = {}) {
    const store = mockStore({ form: { data } });
    return render(
      <Provider store={store}>
        <DefinitionTester
          schema={schema}
          uiSchema={uiSchema}
          definitions={formConfig.defaultDefinitions}
          data={data}
        />
      </Provider>,
    );
  }

  it('renders the institution name, military checkbox, and address fields', () => {
    const { container } = renderPage();

    expect(
      $$(
        'va-text-input[name="root_institutionDetails_institutionName"]',
        container,
      ).length,
    ).to.equal(1);

    expect(
      $$('va-checkbox[name="root_institutionDetails_isMilitary"]', container)
        .length,
    ).to.equal(1);

    expect(
      $$('va-text-input[name^="root_institutionDetails_street"]', container)
        .length,
    ).to.equal(3);
    expect(
      $$('va-text-input[name="root_institutionDetails_city"]', container)
        .length,
    ).to.equal(1);
    expect(
      $$('va-text-input[name="root_institutionDetails_state"]', container)
        .length,
    ).to.equal(1);
    expect(
      $$('va-text-input[name="root_institutionDetails_postalCode"]', container)
        .length,
    ).to.equal(1);
    expect(
      $$('va-select[name="root_institutionDetails_country"]', container).length,
    ).to.equal(1);
  });

  it('shows errors when required fields are empty', () => {
    const { container, getByRole } = renderPage({ institutionDetails: {} });

    fireEvent.click(getByRole('button', { name: /submit/i }));

    const nameInput = container.querySelector(
      'va-text-input[name="root_institutionDetails_institutionName"]',
    );
    expect(nameInput).to.exist;
    expect(nameInput.getAttribute('error')).to.equal(
      'Enter the name of your institution or training facility',
    );

    expect($$('va-text-input[error]', container).length).to.be.at.least(4);

    expect($$('va-select[error]', container).length).to.equal(1);
  });
});
