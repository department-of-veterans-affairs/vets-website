import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
// import { render, fireEvent, waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import formConfig from '../../config/form';

const mockStore = configureStore([]);

describe('22-8894 – Institution Name & Address Page', () => {
  const { schema, uiSchema } =
    formConfig.chapters.institutionDetailsChapter.pages
      .institutionNameAndAddress;

  const renderPage = (data = {}) =>
    render(
      <Provider store={mockStore({ form: { data } })}>
        <DefinitionTester
          schema={schema}
          uiSchema={uiSchema}
          definitions={formConfig.defaultDefinitions}
          data={data}
        />
      </Provider>,
    );

  it('renders the institution name, military checkbox, and address fields', () => {
    const { container } = renderPage();

    expect(
      $$(
        'va-text-input[name="root_institutionDetails_institutionName"]',
        container,
      ).length,
    ).to.equal(1);

    expect(
      $$(
        'va-checkbox[name="root_institutionDetails_institutionAddress_isMilitary"]',
        container,
      ).length,
    ).to.equal(1);
    expect(
      $$(
        'va-text-input[name^="root_institutionDetails_institutionAddress_street"]',
        container,
      ).length,
    ).to.equal(3);
    expect(
      $$(
        'va-text-input[name="root_institutionDetails_institutionAddress_city"]',
        container,
      ).length,
    ).to.equal(1);
    expect(
      $$(
        'va-text-input[name="root_institutionDetails_institutionAddress_state"]',
        container,
      ).length,
    ).to.equal(1);
    expect(
      $$(
        'va-text-input[name="root_institutionDetails_institutionAddress_postalCode"]',
        container,
      ).length,
    ).to.equal(1);
    expect(
      $$(
        'va-select[name="root_institutionDetails_institutionAddress_country"]',
        container,
      ).length,
    ).to.equal(1);
  });

  // it('shows errors when required fields are empty', async () => {
  //   const { container, getByRole } = renderPage({ institutionDetails: {} });

  //   fireEvent.click(getByRole('button', { name: /submit/i }));

  //   await waitFor(() => {
  //     const nameInput = container.querySelector(
  //       'va-text-input[name="root_institutionDetails_institutionName"]',
  //     );
  //     expect(nameInput).to.exist;
  //     expect(nameInput.getAttribute('error')).to.equal(
  //       'Enter the name of your institution or training facility',
  //     );

  //     // at least 4 address-line errors (street, city, state, postalCode)
  //     expect($$('va-text-input[error]', container).length).to.be.at.least(4);
  //     // country error
  //     expect($$('va-select[error]', container).length).to.equal(1);
  //   });
  // });
});
