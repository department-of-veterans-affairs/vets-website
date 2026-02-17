import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  DefinitionTester,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';
import formConfig from '../../../../config/form';

describe('Mailing Address Page', () => {
  const { schema, uiSchema } =
    formConfig.chapters.applicantInformation.pages.mailingAddress;
  it('renders the mailing address fields', async () => {
    const form = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );
    const formDOM = getFormDOM(form);
    expect(form.getByRole('heading')).to.have.text('Your mailing address');

    const vaTextInputs = $$('va-text-input', formDOM);
    const vaSelects = $$('va-select', formDOM);
    const vaCheckboxes = $$('va-checkbox', formDOM);
    const vaAdditionalInfos = $$('va-additional-info', formDOM);

    const vaMailOutsideUS = $(
      'va-checkbox[label="I receive mail outside of the United States on a U.S. military base"]',
      formDOM,
    );
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
    expect(vaCheckboxes.length).to.equal(1);
    expect(vaAdditionalInfos.length).to.equal(1);

    expect(vaMailOutsideUS.getAttribute('required')).to.equal('false');
    expect(vaCountrySelect.getAttribute('required')).to.equal('true');
    expect(vaStreetAddressInput.getAttribute('required')).to.equal('true');
    expect(vaStreetAddress2Input.getAttribute('required')).to.equal('false');
    expect(vaCityInput.getAttribute('required')).to.equal('true');
    expect(vaStateInput.getAttribute('required')).to.equal('false');
    expect(vaPostalCodeInput.getAttribute('required')).to.equal('true');
  });
  it('renders the mailing address fields for military base', async () => {
    const form = render(
      <DefinitionTester schema={schema} uiSchema={uiSchema} data={{}} />,
    );
    const formDOM = getFormDOM(form);
    const vaMailOutsideUS = $(
      'va-checkbox[label="I receive mail outside of the United States on a U.S. military base"]',
      formDOM,
    );
    // Check the checkbox to indicate mailing address is on a military base
    vaMailOutsideUS.__events.vaChange({ target: { checked: true } });
    const vaTextInputs = $$('va-text-input', formDOM);
    const vaSelects = $$('va-select', formDOM);
    const vaRadios = $$('va-radio', formDOM);

    const vaCountrySelect = $('va-select[label="Country"]', formDOM);
    const vaStreetAddressInput = $(
      'va-text-input[label="Street address"]',
      formDOM,
    );
    const vaApartmentInput = $(
      'va-text-input[label="Apartment or unit number"]',
      formDOM,
    );
    const vaPostOffice = $('va-radio[label="Military post office"]', formDOM);
    const vaOverseasAbbreviation = $('va-radio[label^="Overseas"]', formDOM);
    const vaPostalCodeInput = $('va-text-input[label="Postal code"]', formDOM);

    expect(vaTextInputs.length).to.equal(3);
    expect(vaSelects.length).to.equal(1);
    expect(vaRadios.length).to.equal(2);

    expect(vaCountrySelect.getAttribute('value')).to.equal('USA');
    expect(vaStreetAddressInput.getAttribute('required')).to.equal('true');
    expect(vaApartmentInput.getAttribute('required')).to.equal('false');
    expect(vaPostOffice.getAttribute('required')).to.equal('true');
    expect(vaOverseasAbbreviation.getAttribute('required')).to.equal('true');
    expect(vaPostalCodeInput.getAttribute('required')).to.equal('true');
  });
});
