import React from 'react';
import { expect } from 'chai';
import { render, cleanup, waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import * as page from '../../pages/MailingAddress';

const renderPage = (formData = {}) =>
  render(
    <DefinitionTester
      schema={page.schema}
      uiSchema={page.uiSchema}
      data={formData}
      definitions={{}}
    />,
  );

describe('22-0803 Mailing address page', () => {
  afterEach(cleanup);

  it('renders the military checkbox and address fields', () => {
    const { container } = renderPage();

    expect(
      $$('va-checkbox[name="root_mailingAddress_isMilitary"]', container)
        .length,
    ).to.equal(1);
    expect(
      $$('va-select[name="root_mailingAddress_country"]', container).length,
    ).to.equal(1);
    expect(
      $$('va-text-input[name^="root_mailingAddress_street"]', container).length,
    ).to.equal(3);
    expect(
      $$('va-text-input[name="root_mailingAddress_city"]', container).length,
    ).to.equal(1);
    expect(
      $$('va-text-input[name="root_mailingAddress_state"]', container).length,
    ).to.equal(1);
    expect(
      $$('va-text-input[name="root_mailingAddress_postalCode"]', container)
        .length,
    ).to.equal(1);
  });

  it('renders separate fields when the military checkbox is checked', () => {
    const { container } = renderPage({ mailingAddress: { isMilitary: true } });

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
      $$('va-radio[name="root_mailingAddress_state"]', container).length,
    ).to.equal(1);
    expect($$('va-text-input[label="Postal code"]', container).length).to.equal(
      1,
    );
  });

  it('shows errors when required fields are empty', async () => {
    const { container, getByRole } = renderPage();

    getByRole('button', { name: /submit/i }).click();

    await waitFor(() => {
      // at least 3 address-line errors (street, city, postalCode)
      expect($$('va-text-input[error]', container).length).to.equal(3);
      // country error
      expect($$('va-select[error]', container).length).to.equal(1);
    });
  });
});
