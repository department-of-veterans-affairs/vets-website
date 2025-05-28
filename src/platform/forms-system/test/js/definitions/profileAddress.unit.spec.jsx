import React from 'react';
import { expect } from 'chai';
import { render, fireEvent } from '@testing-library/react';
import { $, $$ } from 'platform/forms-system/src/js/utilities/ui';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

import addressUISchema, {
  schemaCrossXRef,
  STATE_VALUES,
  STATE_NAMES,
  COUNTRY_VALUES,
  COUNTRY_NAMES,
  updateFormDataAddress,
} from '../../../src/js/definitions/profileAddress';

const mouseClick = new MouseEvent('click', {
  bubbles: true,
  cancelable: true,
});

const updateFormData = (oldFormData, formData) =>
  updateFormDataAddress(oldFormData, formData, 'address');

const getAddressSchema = (xref = {}) => {
  const keys = { ...schemaCrossXRef, ...xref };
  return {
    type: 'object',
    properties: {
      address: {
        type: 'object',
        properties: {
          [keys.isMilitary]: {
            type: 'boolean',
          },
          [keys['view:militaryBaseDescription']]: {
            type: 'object',
            properties: {},
          },
          [keys.country]: {
            type: 'string',
            default: 'USA',
            enum: COUNTRY_VALUES,
            enumNames: COUNTRY_NAMES,
          },
          [keys.street]: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
          },
          [keys.street2]: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
          },
          [keys.street3]: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
          },
          [keys.city]: {
            type: 'string',
          },
          [keys.state]: {
            type: 'string',
            enum: STATE_VALUES,
            enumNames: STATE_NAMES,
          },
          [keys.postalCode]: {
            type: 'string',
          },
        },
      },
    },
  };
};

const getUiSchema = (
  required = false,
  keys = {},
  path = 'address',
  militaryCheckboxTitle = 'base outside',
) => ({
  address: addressUISchema(path, militaryCheckboxTitle, () => required, keys),
});

const getFormData = data => ({
  address: {
    country: 'USA',
    ...(data || {}),
  },
});

describe('Schemaform definition address', () => {
  it('should render address', () => {
    const { container, getByLabelText } = render(
      <DefinitionTester
        schema={getAddressSchema()}
        uiSchema={getUiSchema()}
        data={getFormData()}
        updateFormData={updateFormData}
      />,
    );

    expect(getByLabelText('base outside', { exact: true })).to.exist;
    expect(getByLabelText('Country', { exact: true })).to.exist;
    expect(getByLabelText('Street address', { exact: true })).to.exist;
    expect(getByLabelText('Street address line 2', { exact: true })).to.exist;
    expect(getByLabelText('Street address line 3', { exact: true })).to.exist;
    expect(getByLabelText('City', { exact: true })).to.exist;
    // State label includes required text
    expect(getByLabelText('State', { exact: false })).to.exist;
    expect(getByLabelText('Postal code', { exact: true })).to.exist;

    // Count the form elements
    const inputs = $$('input', container);
    const selects = $$('select', container);

    expect(inputs.length).to.equal(6);
    expect(selects.length).to.equal(2);

    // Postal code should be small
    expect(inputs[5].className.includes('usa-input-medium')).to.be.true;

    // country is USA and there is no blank option
    expect(selects[0].value).to.equal('USA');
    expect([...selects[0].children].every(opt => !!opt.value)).to.be.true;
  });

  it('should have required inputs if required', () => {
    const { container } = render(
      <DefinitionTester
        schema={getAddressSchema()}
        uiSchema={getUiSchema(true)}
        data={getFormData()}
        updateFormData={updateFormData}
      />,
    );

    const requiredInputs = $$('span.schemaform-required-span', container);
    expect(requiredInputs.length).to.equal(5);
  });

  it('should update address field', () => {
    const { getByLabelText } = render(
      <DefinitionTester
        schema={getAddressSchema()}
        uiSchema={getUiSchema()}
        data={getFormData()}
        updateFormData={updateFormData}
      />,
    );

    const street = getByLabelText('Street address', { exact: true });
    fireEvent.change(street, { target: { value: '123 Street' } });
    expect(street.value).to.equal('123 Street');
  });

  it('should update country field in empty address', () => {
    const { getByLabelText } = render(
      <DefinitionTester
        schema={getAddressSchema()}
        uiSchema={getUiSchema()}
        data={getFormData()}
        updateFormData={updateFormData}
      />,
    );

    const country = getByLabelText('Country', { exact: true });
    fireEvent.change(country, { target: { value: 'CAN' } });
    expect(country.value).to.equal('CAN');
  });

  it('should require state for non-required addresses with other info', () => {
    const { container } = render(
      <DefinitionTester
        schema={getAddressSchema()}
        uiSchema={getUiSchema(true)}
        data={getFormData()}
        updateFormData={updateFormData}
      />,
    );

    const street = $('#root_address_street', container);
    const city = $('#root_address_city', container);
    const postalCode = $('#root_address_postalCode', container);
    const submit = $('button', container);

    fireEvent.change(street, { target: { value: '123 Street' } });
    fireEvent.change(city, { target: { value: 'Northampton' } });
    fireEvent.change(postalCode, { target: { value: '12345' } });

    fireEvent(submit, mouseClick);
    const errors = $$('[role="alert"]');
    expect(errors.length).to.equal(1);
    expect(errors[0].textContent).to.include('State, Province, or Region');
  });

  it('should restore city & state fields after selecting military city & state', async () => {
    const { getByLabelText } = render(
      <DefinitionTester
        schema={getAddressSchema()}
        uiSchema={getUiSchema()}
        data={getFormData()}
        updateFormData={updateFormData}
      />,
    );

    const base = getByLabelText('base outside', { exact: true });
    const country = getByLabelText('Country', { exact: false });
    const city = getByLabelText('City', { exact: true });
    const state = getByLabelText('State', { exact: false });

    expect(city).to.exist;
    expect(state).to.exist;

    fireEvent.change(city, { target: { value: 'Test city' } });
    fireEvent.change(state, { target: { value: 'OR' } });
    await expect(city.value).to.equal('Test city');
    await expect(state.value).to.equal('OR');

    fireEvent.click(base, mouseClick);
    await expect(base.checked).to.be.true;

    await expect(country.disabled).to.be.true;

    const militaryCity = getByLabelText('APO/FPO/DPO', { exact: true });

    await expect(militaryCity.value).to.equal('');
    await expect(state.value).to.equal('');
    fireEvent.change(city, { target: { value: 'APO' } });
    fireEvent.change(state, { target: { value: 'AA' } });
    await expect(city.value).to.equal('APO');
    await expect(state.value).to.equal('AA');

    fireEvent.click(base, mouseClick);
    await expect(base.checked).to.be.false;

    const city2 = getByLabelText('City', { exact: true });
    await expect(city2.value).to.equal('Test city');
    await expect(state.value).to.equal('OR');
  });

  it('should render address with different keys', () => {
    const testKeys = {
      isMilitary: 'isBase',
      'view:militaryBaseDescription': 'view:baseDescription',
      country: 'countryCode',
      street: 'address1',
      street2: 'address2',
      street3: 'address3',
      city: 'cityCode',
      state: 'stateCode',
      postalCode: 'zipCode',
    };
    const data = {
      address: {
        isBase: false,
        countryCode: 'CAN',
        address1: '123 test',
        address2: 'building 32',
        address3: 'Suite 200',
        cityCode: 'A City',
        stateCode: 'GA',
        zipCode: '77755',
      },
    };
    const { container, getByLabelText } = render(
      <DefinitionTester
        schema={getAddressSchema(testKeys)}
        uiSchema={getUiSchema(false, testKeys)}
        data={data}
        updateFormData={updateFormData}
      />,
    );

    const base = getByLabelText('base outside', { exact: true });
    const country = getByLabelText('Country', { exact: true });
    const street1 = getByLabelText('Street address', { exact: true });
    const street2 = getByLabelText('Street address line 2', { exact: true });
    const street3 = getByLabelText('Street address line 3', { exact: true });
    const city = getByLabelText('City', { exact: true });
    // State label includes required text
    const state = getByLabelText('State', { exact: false });
    const postal = getByLabelText('Postal code', { exact: true });

    // Count the form elements
    const inputs = $$('input', container);
    const selects = $$('select', container);

    expect(inputs.length).to.equal(7);
    expect(selects.length).to.equal(1);

    expect(base).to.exist;
    expect(inputs[0].id).to.equal('root_address_isBase');
    expect(inputs[0].checked).to.be.false;

    expect(country).to.exist;
    expect(selects[0].id).to.equal('root_address_countryCode');
    expect(selects[0].value).to.equal('CAN');

    expect(street1).to.exist;
    expect(inputs[1].id).to.equal('root_address_address1');
    expect(inputs[1].value).to.equal('123 test');

    expect(street2).to.exist;
    expect(inputs[2].id).to.equal('root_address_address2');
    expect(inputs[2].value).to.equal('building 32');

    expect(street3).to.exist;
    expect(inputs[3].id).to.equal('root_address_address3');
    expect(inputs[3].value).to.equal('Suite 200');

    expect(city).to.exist;
    expect(inputs[4].id).to.equal('root_address_cityCode');
    expect(inputs[4].value).to.equal('A City');

    expect(state).to.exist;
    expect(inputs[5].id).to.equal('root_address_stateCode');
    expect(inputs[5].value).to.equal('GA');

    expect(postal).to.exist;
    expect(inputs[6].id).to.equal('root_address_zipCode');
    expect(inputs[6].value).to.equal('77755');
  });
});
