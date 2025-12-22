import React from 'react';
import { expect } from 'chai';
import { render, cleanup, waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import * as page from '../../pages/OrganizationInfo';

const renderPage = (formData = {}) =>
  render(
    <DefinitionTester
      schema={page.schema}
      uiSchema={page.uiSchema}
      data={formData}
      definitions={{}}
    />,
  );

describe('22-0803 organization info page', () => {
  afterEach(cleanup);

  it('renders input for organization name', () => {
    const { container } = renderPage();

    expect(
      $$('va-text-input[name^="root_organizationName"]', container).length,
    ).to.equal(1);
  });

  it('renders the address fields', () => {
    const { container } = renderPage();

    expect(
      $$('va-text-input[name^="root_organizationAddress_street"]', container)
        .length,
    ).to.equal(3);
    expect(
      $$('va-text-input[name="root_organizationAddress_city"]', container)
        .length,
    ).to.equal(1);
    expect(
      $$('va-select[name="root_organizationAddress_state"]', container).length,
    ).to.equal(1);
    expect(
      $$('va-text-input[name="root_organizationAddress_postalCode"]', container)
        .length,
    ).to.equal(1);
  });

  it('shows errors when required fields are empty', async () => {
    const { container, getByRole } = renderPage();

    getByRole('button', { name: /submit/i }).click();

    await waitFor(() => {
      // empty org name + address line errors
      expect($$('va-text-input[error]', container).length).to.equal(4);
    });
  });
});
