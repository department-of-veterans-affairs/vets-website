import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';
import page from '../../pages/thirdPartyOrganizationRepresentativesName';

const renderPage = (formData = {}) =>
  render(
    <DefinitionTester
      schema={page.schema}
      uiSchema={page.uiSchema}
      data={formData}
      definitions={formConfig.defaultDefinitions}
    />,
  );

describe('10278 thirdPartyOrganizationRepresentativesName page', () => {
  it('renders the page title', () => {
    const { getByText } = renderPage();
    getByText('Name of organization’s representatives');
  });

  it('renders full name fields', () => {
    const { container } = renderPage();
    expect(
      container.querySelectorAll('va-text-input[name^="root_fullName_"]')
        .length,
    ).to.be.greaterThan(0);
  });

  it('has required fields in schema', () => {
    expect(page.schema.type).to.equal('object');
    expect(page.schema.required).to.deep.equal(['fullName']);
    expect(page.schema.properties).to.have.property('fullName');
  });

  it('renders without errors when form data is provided', () => {
    const { container } = renderPage({
      fullName: {
        first: 'John',
        last: 'Doe',
      },
    });

    expect(container.querySelectorAll('[error]')).to.have.length(0);
  });
});
