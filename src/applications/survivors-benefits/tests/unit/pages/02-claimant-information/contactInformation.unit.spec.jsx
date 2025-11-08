import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import contactInformation from '../../../../config/chapters/02-claimant-information/contactInformation';

describe('Claimant Information Page', () => {
  const { schema, uiSchema } = contactInformation;
  it('renders the claimant information page', async () => {
    const form = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );
    const formDOM = getFormDOM(form);
    expect(form.getByRole('heading')).to.have.text(
      'Email address and phone number',
    );

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
});
