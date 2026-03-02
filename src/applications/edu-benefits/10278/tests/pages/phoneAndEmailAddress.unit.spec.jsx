import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { $$ } from 'platform/forms-system/src/js/utilities/ui';
import page from '../../pages/phoneAndEmailAddress';
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

describe('22-10278 phone and email address page', () => {
  it('renders the page title', () => {
    const { getByText } = renderPage();
    expect(getByText('Your phone and email address')).to.exist;
  });

  it('renders phone number field', () => {
    const { container } = renderPage();
    expect(
      $$('va-telephone-input[label="Phone number"]', container).length,
    ).to.equal(1);
  });

  it('renders email address field with hint', () => {
    const { container } = renderPage();
    const emailInput = container.querySelector('va-text-input[type="email"]');
    expect(emailInput).to.exist;
    expect(emailInput.getAttribute('hint')).to.equal(
      "We'll use this email address to send you notifications in regards to your claim",
    );
  });

  it('renders without errors when phone number is provided', () => {
    const { container } = renderPage({
      claimantContactInformation: {
        phoneNumber: {
          countryCode: '1',
          areaCode: '555',
          phoneNumber: '1234567',
        },
      },
    });
    expect(container.querySelectorAll('[error]')).to.have.length(0);
  });
});
