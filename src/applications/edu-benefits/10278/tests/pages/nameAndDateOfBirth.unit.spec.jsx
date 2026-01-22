import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import page from '../../pages/nameAndDateOfBirth';
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

describe('22-10278 name and date of birth page', () => {
  it('renders full name field', () => {
    const { container } = renderPage();
    expect(
      $$(
        'va-text-input[name^="root_claimantPersonalInformation_fullName"]',
        container,
      ).length,
    ).to.be.greaterThan(0);
  });

  it('renders date of birth field', () => {
    const { container } = renderPage();
    expect($$('va-memorable-date', container).length).to.equal(1);
  });

  it('has required fields in schema', () => {
    expect(page.schema.required).to.include('claimantPersonalInformation');
    const claimantRequired =
      page.schema.properties.claimantPersonalInformation.required;
    expect(claimantRequired).to.include('fullName');
    expect(claimantRequired).to.include('dateOfBirth');
  });

  it('renders without errors when form data is provided', () => {
    const { container } = renderPage({
      claimantPersonalInformation: {
        fullName: {
          first: 'John',
          last: 'Doe',
        },
        dateOfBirth: '1990-01-01',
      },
    });
    expect(container.querySelectorAll('[error]')).to.have.length(0);
  });
});
