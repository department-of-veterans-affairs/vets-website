import React from 'react';
import { expect } from 'chai';
import { render, cleanup, waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../config/form';

describe('22-10272 Licensing and Certification Details Step 3 - Page 2', () => {
  afterEach(cleanup);

  const {
    schema,
    uiSchema,
  } = formConfig.chapters.licensingAndCertificationChapter.pages.organizationInfo;

  const renderPage = (
    formData = {
      organizationAddress: { country: 'USA' },
    },
  ) =>
    render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
        definitions={{}}
      />,
    );

  it('renders text input for organization name', () => {
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
