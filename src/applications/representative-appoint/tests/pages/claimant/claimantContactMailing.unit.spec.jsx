import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $ } from 'platform/forms-system/src/js/utilities/ui';

import formConfig from '../../../config/form';

describe('Claimant Contact Mailing page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.claimantInfo.pages.claimantContactMailing;

  // Custom page is rendered, so this only renders a submit button
  it.skip('should render', () => {
    const { container } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    expect($('button[type="submit"]', container)).to.exist;
  });

  it('should have proper max lengths for address fields', () => {
    const addressProps = schema.properties.homeAddress.properties;

    expect(addressProps.street.maxLength).to.equal(30);
    expect(addressProps.street2.maxLength).to.equal(5);
    expect(addressProps.city.maxLength).to.equal(18);
    expect(addressProps.state.maxLength).to.equal(2);
    expect(addressProps.postalCode.maxLength).to.equal(9);
  });
});
