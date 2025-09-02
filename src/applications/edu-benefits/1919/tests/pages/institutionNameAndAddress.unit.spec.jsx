import React from 'react';
import { expect } from 'chai';
import { render, cleanup, waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import formConfig from '../../config/form';

const mockStore = configureStore([]);

describe("22-1919 Institution's name and address", () => {
  afterEach(cleanup);

  const {
    schema,
    uiSchema,
  } = formConfig.chapters.institutionDetailsChapter.pages.institutionNameAndAddress;

  const renderPage = (
    data = {
      institutionDetails: {
        institutionAddress: { country: 'USA' },
      },
    },
  ) =>
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
        'va-select[name="root_institutionDetails_institutionAddress_country"]',
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
        'va-select[name="root_institutionDetails_institutionAddress_state"]',
        container,
      ).length,
    ).to.equal(1);
    expect(
      $$(
        'va-text-input[name="root_institutionDetails_institutionAddress_postalCode"]',
        container,
      ).length,
    ).to.equal(1);
  });

  it('renders separate fields when the military checkbox is checked', () => {
    const { container } = renderPage({
      institutionDetails: {
        institutionAddress: { country: 'USA', isMilitary: true },
      },
    });

    expect(
      $$('va-text-input[label="Street address"]', container).length,
    ).to.equal(1);
    expect(
      $$('va-text-input[label="Apartment or unit number"]', container).length,
    ).to.equal(1);
    expect(
      $$('va-text-input[label="Additional address information"]', container)
        .length,
    ).to.equal(1);
    expect(
      $$('va-radio[label="Military post office"]', container).length,
    ).to.equal(1);
    expect(
      $$(
        'va-radio[name="root_institutionDetails_institutionAddress_state"]',
        container,
      ).length,
    ).to.equal(1);
    expect($$('va-text-input[label="Postal code"]', container).length).to.equal(
      1,
    );
  });

  it('shows errors when required fields are empty', async () => {
    const { container, getByRole } = renderPage();

    getByRole('button', { name: /submit/i }).click();

    await waitFor(() => {
      // at least 4 form errors (institution name, street, city, postalCode)
      expect($$('va-text-input[error]', container).length).to.equal(4);
      // state error
      expect($$('va-select[error]', container).length).to.equal(1);
    });
  });
});
