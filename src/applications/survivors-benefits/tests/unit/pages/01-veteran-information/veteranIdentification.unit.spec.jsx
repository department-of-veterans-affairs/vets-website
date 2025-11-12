import React from 'react';
import { expect } from 'chai';
import { render, waitFor } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import veteranIdentification from '../../../../config/chapters/01-veteran-information/veteranIdentification';

describe('Claimant Information Page', () => {
  const { schema, uiSchema } = veteranIdentification;
  it('renders the veteran identification page', async () => {
    const form = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );
    const formDOM = getFormDOM(form);

    expect(form.getByRole('heading')).to.have.text(
      'Veteran’s identification information',
    );

    expect(formDOM.querySelector('fieldset > p')).to.exist;

    expect(formDOM.querySelector('fieldset > p')).to.have.text(
      'You must enter either a Social Security number or a VA File number.',
    );

    const vaTextInput = $$('va-text-input', formDOM);

    const vaSsn = $('va-text-input[label="Social Security number"]', formDOM);
    const vaFileNumber = $('va-text-input[label="VA file number"]', formDOM);

    expect(vaTextInput.length).to.equal(2);

    expect(vaSsn.getAttribute('required')).to.equal('true');
    expect(vaFileNumber.getAttribute('required')).to.equal('false');

    vaFileNumber.dispatchEvent(
      new CustomEvent('focus', {
        bubbles: true,
      }),
    );

    // Set the value attribute directly on the web component
    vaFileNumber.setAttribute('value', '12345678');

    // Fill out the VA file number field using web component event
    vaFileNumber.value = '12345678';
    vaFileNumber.dispatchEvent(
      new CustomEvent('input', {
        detail: { value: '12345678' },
        bubbles: true,
      }),
    );

    vaFileNumber.dispatchEvent(
      new CustomEvent('blur', {
        bubbles: true,
      }),
    );

    const formElement = formDOM.querySelector('form');
    formElement.dispatchEvent(
      new CustomEvent('change', {
        bubbles: true,
      }),
    );

    // Wait for the form to process the change
    await waitFor(
      () => {
        expect(vaFileNumber.getAttribute('value')).to.equal('12345678');
        expect(vaSsn.getAttribute('required')).to.equal('false');
        expect(vaFileNumber.getAttribute('required')).to.equal('true');
      },
      { timeout: 5000 },
    );
  });
});
