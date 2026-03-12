import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import claimantContact from '../../../pages/claimantContact';

describe('Claimant Information Page', () => {
  const { schema, uiSchema } = claimantContact;
  it('renders the claimant information page', async () => {
    const form = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );
    const formDOM = getFormDOM(form);
    const vaEmailInputs = $$('va-text-input', formDOM);
    const vaTelephoneInputs = $$('va-telephone-input', formDOM);
    const vaEmailInput = $('va-text-input[label="Email"]', formDOM);
    const vaTelephoneInput = $(
      'va-telephone-input[label="Primary phone number"]',
      formDOM,
    );

    expect(vaTelephoneInputs.length).to.equal(1);
    expect(vaEmailInputs.length).to.equal(1);
    expect(vaEmailInput.getAttribute('required')).to.equal('true');
    expect(vaTelephoneInput.getAttribute('required')).to.equal('true');
  });
  it('should show the correct title for surviving spouse', () => {
    const form = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{ claimantRelationship: 'SURVIVING_SPOUSE' }}
      />,
    );
    expect(form.getByRole('heading')).to.have.text(
      'Your email address and phone number',
    );
  });
  it('should show the correct title for custodian', () => {
    const form = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{ claimantRelationship: 'CUSTODIAN_FILING_FOR_CHILD_UNDER_18' }}
      />,
    );
    expect(form.getByRole('heading')).to.have.text(
      'Child’s email address and phone number',
    );
  });
  it('should show the correct title for adult child', () => {
    const form = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{ claimantRelationship: 'CHILD_18-23_IN_SCHOOL' }}
      />,
    );
    expect(form.getByRole('heading')).to.have.text(
      'Your email address and phone number',
    );
  });
  it('should show the correct title for helpless adult child', () => {
    const form = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={{ claimantRelationship: 'HELPLESS_ADULT_CHILD' }}
      />,
    );
    expect(form.getByRole('heading')).to.have.text(
      'Your email address and phone number',
    );
  });
});
