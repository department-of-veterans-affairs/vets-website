import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { findDOMNode } from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';

import {
  DefinitionTester,
  fillData,
} from 'platform/testing/unit/schemaform-utils';
import definitions from 'vets-json-schema/dist/definitions.json';
import { schema, uiSchema } from '../../../src/js/definitions/address';

const { address } = definitions;
const addressSchema = {
  definitions: {
    address,
  },
};

describe('Schemaform definition address', () => {
  it('should render address', () => {
    const s = schema(addressSchema, false);
    const uis = uiSchema();
    const form = mount(<DefinitionTester schema={s} uiSchema={uis} />);

    // Count the form elements
    const inputs = form.find('input');
    const selects = form.find('select');
    expect(inputs.length).to.equal(4);
    // address in definitions.json does not include address line 3
    expect(inputs.first().props().autoComplete).to.equal('address-line1');
    expect(inputs.at(1).props().autoComplete).to.equal('address-line2');
    expect(inputs.at(2).props().autoComplete).to.equal('address-level2'); // city
    expect(inputs.last().props().autoComplete).to.equal('postal-code');
    expect(selects.length).to.equal(2);

    // Postal code should be small
    expect(inputs.last().is('.usa-input-medium')).to.be.true;

    // country is USA and there is no blank option
    expect(selects.first().props().value).to.equal('USA');
    expect(
      selects
        .first()
        .find('option')
        .everyWhere(n => !!n.props().value),
    ).to.be.true;
    form.unmount();
  }).timeout(4000);

  it('should have required inputs if required', () => {
    const s = schema(addressSchema, true);
    const uis = uiSchema();
    const form = mount(<DefinitionTester schema={s} uiSchema={uis} />);

    // Ideally, we'd get the required inputs, not the <span>s denoting required
    //  fields but this doesn't work.
    // const requiredInputs = formDOM.querySelectorAll('input[required=true]');
    const requiredInputs = form
      .find('label')
      .find('span.schemaform-required-span');
    expect(requiredInputs.length).to.not.equal(0);
    form.unmount();
  }).timeout(4000);

  it('should update labels and state selection conditionally', () => {
    const s = schema(addressSchema, false);
    const uis = uiSchema();
    const form = mount(<DefinitionTester schema={s} uiSchema={uis} />);

    const labels = form.find('label');
    const postalCodeLabel = labels.findWhere(
      label => label.props().htmlFor === 'root_postalCode',
    );
    const stateLabel = labels.findWhere(
      label => label.props().htmlFor === 'root_state',
    );
    const stateField = form.find('select#root_state');

    // Check the labels' text
    expect(postalCodeLabel.text()).to.equal('Postal code');
    expect(stateLabel.text()).to.equal('State');

    // And state input type / options
    expect(stateField.find('option').someWhere(n => n.props().value === 'OR'))
      .to.be.true;

    // Entering a military city should result in different "state" options
    fillData(form, 'input#root_city', 'apo');
    expect(stateField.find('option').someWhere(n => n.props().value === 'AA'))
      .to.be.true;

    // Change the country
    fillData(form, 'select#root_country', 'CAN');

    // Check to see if the postal code and state updated
    expect(stateLabel.text()).to.equal('Province');
    expect(postalCodeLabel.text()).to.equal('Postal code');
    expect(
      form
        .find('select#root_state')
        .find('option')
        .someWhere(n => n.props().value === 'QC'),
    ).to.be.true;

    // Check for Mexican states
    fillData(form, 'select#root_country', 'MEX');
    expect(
      form
        .find('select#root_state')
        .find('option')
        .someWhere(n => n.props().value === 'guerrero'),
    ).to.be.true;

    // Change to another country that doesn't have a select box for state
    fillData(form, 'select#root_country', 'BEL');
    expect(form.find('input#root_state').exists()).to.be.true;
    form.unmount();
  }).timeout(4000);

  it('should update address field', () => {
    const s = schema(addressSchema, false);
    const uis = uiSchema();
    const form = mount(<DefinitionTester schema={s} uiSchema={uis} />);

    fillData(form, 'input#root_street', '123 street');

    expect(form.find('input#root_street').props().value).to.equal('123 street');
    form.unmount();
  }).timeout(4000);

  it('should update country field in empty address', () => {
    const s = schema(addressSchema, false);
    const uis = uiSchema();
    const form = mount(<DefinitionTester schema={s} uiSchema={uis} />);

    fillData(form, 'select#root_country', 'CAN');

    expect(form.find('select#root_country').props().value).to.equal('CAN');
    form.unmount();
  }).timeout(4000);

  it('should require state for non-required addresses with other info', async () => {
    const s = schema(addressSchema, false);
    const uis = uiSchema();
    const form = render(<DefinitionTester schema={s} uiSchema={uis} />);

    const streetInput = form.container.querySelector('input#root_street');
    fireEvent.change(streetInput, { target: { value: '123 st' } });

    const cityInput = form.container.querySelector('input#root_city');
    fireEvent.change(cityInput, { target: { value: 'Northampton' } });

    const postalCodeInput = form.container.querySelector(
      'input#root_postalCode',
    );
    fireEvent.change(postalCodeInput, { target: { value: '12345' } });

    const submitButton = form.getByRole('button', { name: 'Submit' });
    const mouseClick = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });
    fireEvent(submitButton, mouseClick);

    await waitFor(() => {
      form.getByText(
        'Please enter a state or province, or remove other address information.',
      );
    });
  });

  it('should contain state maxLength in accordance with schema', () => {
    definitions.address.oneOf[3].properties.state.maxLength = 2;

    const newAddress = definitions.address;

    const newAddressSchema = {
      definitions: {
        address: newAddress,
      },
    };

    const s = schema(newAddressSchema, false);
    s.properties.state.maxLength = 2;

    const uis = uiSchema();

    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester schema={s} uiSchema={uis} />,
    );

    const formDOM = findDOMNode(form);
    const countrySelect = formDOM.querySelector('select#root_country');
    countrySelect.value = 'BEL';
    ReactTestUtils.Simulate.change(countrySelect);

    expect(
      formDOM.querySelector('#root_state').getAttribute('maxlength'),
    ).to.equal('2');
  }).timeout(4000);
});
