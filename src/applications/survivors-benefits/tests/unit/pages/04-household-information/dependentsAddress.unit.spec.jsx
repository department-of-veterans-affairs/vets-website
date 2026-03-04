import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import mailingAddress from '../../../../config/chapters/04-household-information/dependentsAddress';

describe('Dependents mailing address page', () => {
  const { schema, uiSchema } = mailingAddress;
  it('renders the mailing address fields', async () => {
    const form = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );
    const formDOM = getFormDOM(form);
    expect(form.getByRole('heading')).to.have.text(
      'Dependent’s mailing address',
    );

    const vaTextInputs = $$('va-text-input', formDOM);
    const vaSelects = $$('va-select', formDOM);
    const vaCheckboxes = $$('va-checkbox', formDOM);

    const vaCountrySelect = $('va-select[label="Country"]', formDOM);
    const vaStreetAddressInput = $(
      'va-text-input[label="Street address"]',
      formDOM,
    );
    const vaStreetAddress2Input = $(
      'va-text-input[label="Apartment or unit number"]',
      formDOM,
    );
    const vaCityInput = $('va-text-input[label="City"]', formDOM);
    const vaStateInput = $(
      'va-text-input[label="State, province, or region"]',
      formDOM,
    );
    const vaPostalCodeInput = $('va-text-input[label="Postal code"]', formDOM);

    expect(vaTextInputs.length).to.equal(5);
    expect(vaSelects.length).to.equal(1);
    expect(vaCheckboxes.length).to.equal(0);

    expect(vaCountrySelect.getAttribute('required')).to.equal('true');
    expect(vaStreetAddressInput.getAttribute('required')).to.equal('true');
    expect(vaStreetAddress2Input.getAttribute('required')).to.equal('false');
    expect(vaCityInput.getAttribute('required')).to.equal('true');
    expect(vaStateInput.getAttribute('required')).to.equal('false');
    expect(vaPostalCodeInput.getAttribute('required')).to.equal('true');
  });
});
