import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

import mockFormData from '../../fixtures/data/form-data.json';

import formConfig from '../../../config/form';

describe('Veteran Contact Mailing page', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.claimantInfo.pages.veteranContactMailing;

  it.skip('should render', () => {
    const { container } = render(
      <DefinitionTester
        definitions={{}}
        schema={schema}
        uiSchema={uiSchema}
        data={mockFormData}
        formData={mockFormData}
      />,
    );

    expect(container.querySelector('button[type="submit"]')).to.exist;
  });

  it('should have proper max lengths for address fields', () => {
    const addressProps = schema.properties.veteranHomeAddress.properties;

    expect(addressProps.street.maxLength).to.equal(30);
    expect(addressProps.street2.maxLength).to.equal(5);
    expect(addressProps.city.maxLength).to.equal(18);
    expect(addressProps.state.maxLength).to.equal(2);
    expect(addressProps.postalCode.maxLength).to.equal(9);
  });
});
