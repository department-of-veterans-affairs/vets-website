import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import page from '../../pages/mailingAddress';
import formConfig from '../../config/form';

const renderPage = (formData = {}) =>
  render(
    <DefinitionTester
      schema={page.schema}
      uiSchema={page.uiSchema}
      data={formData}
      definitions={formConfig.defaultDefinitions}
    />,
  );

describe('22-10278 mailing address page', () => {
  it('renders address fields', () => {
    const { container } = renderPage();
    expect(
      $$('va-select[name="root_claimantAddress_country"]', container).length,
    ).to.equal(1);
    expect(
      $$('va-text-input[name^="root_claimantAddress_street"]', container)
        .length,
    ).to.equal(3);
    expect(
      $$('va-text-input[name="root_claimantAddress_city"]', container).length,
    ).to.equal(1);
    expect(
      $$('va-text-input[name="root_claimantAddress_postalCode"]', container)
        .length,
    ).to.equal(1);
  });

  it('has country default set to USA', () => {
    expect(
      page.schema.properties.claimantAddress.properties.country.default,
    ).to.equal('USA');
  });
});
