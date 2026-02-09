import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import page from '../../pages/identificationInformation';
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

describe('22-10278 identification information page', () => {
  it('renders the page title', () => {
    const { getByText } = renderPage();
    expect(getByText('Identification information')).to.exist;
  });

  it('renders the page description', () => {
    const { getByText } = renderPage();
    expect(
      getByText('You must enter a Social Security number or VA file number'),
    ).to.exist;
  });

  it('renders SSN and VA file number fields', () => {
    const { container } = renderPage();
    expect(
      $$(
        'va-text-input[name="root_claimantPersonalInformation_veteranId_ssn"]',
        container,
      ).length,
    ).to.equal(1);
    expect(
      $$(
        'va-text-input[name="root_claimantPersonalInformation_veteranId_vaFileNumber"]',
        container,
      ).length,
    ).to.equal(1);
  });

  it('renders without errors when veteran ID is provided', () => {
    const { container } = renderPage({
      claimantPersonalInformation: {
        veteranId: {
          ssn: '123456789',
        },
      },
    });
    expect(container.querySelectorAll('[error]')).to.have.length(0);
  });
});
