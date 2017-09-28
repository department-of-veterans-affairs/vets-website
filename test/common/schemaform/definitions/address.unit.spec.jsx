import React from 'react';
import { findDOMNode } from 'react-dom';
import { expect } from 'chai';
import ReactTestUtils from 'react-dom/test-utils';

import { DefinitionTester } from '../../../util/schemaform-utils.jsx';
import { schema, uiSchema } from '../../../../src/js/common/schemaform/definitions/address';
import { address } from 'vets-json-schema/dist/definitions.json';

const addressSchema = {
  definitions: {
    address
  }
};

describe('Schemaform definition address', () => {
  it('should render address', () => {
    const s = schema(addressSchema, false);
    const uis = uiSchema();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={s}
        uiSchema={uis}/>
    );

    const formDOM = findDOMNode(form);

    // Count the form elements
    const inputs = formDOM.querySelectorAll('input');
    const selects = formDOM.querySelectorAll('select');
    expect(inputs.length).to.equal(4);
    expect(selects.length).to.equal(2);

    // Postal code should be small
    expect(inputs[inputs.length - 1].classList.contains('usa-input-medium')).to.be.true;

    // country is USA and there is no blank option
    expect(selects[0].value).to.equal('USA');
    expect(Array.from(selects[0].options).every(option => !!option.value)).to.be.true;
  }).timeout(4000);

  it('should have required inputs if required', () => {
    const s = schema(addressSchema, true);
    const uis = uiSchema();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={s}
        uiSchema={uis}/>
    );

    const formDOM = findDOMNode(form);

    // Ideally, we'd get the required inputs, not the <span>s denoting required
    //  fields but this doesn't work.
    // const requiredInputs = formDOM.querySelectorAll('input[required=true]');
    const requiredInputs = formDOM.querySelectorAll('label span.schemaform-required-span');
    expect(requiredInputs.length).to.not.equal(0);
  }).timeout(4000);

  it('should update labels and state selection conditionally', () => {
    const s = schema(addressSchema, false);
    const uis = uiSchema();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={s}
        uiSchema={uis}/>
    );

    const formDOM = findDOMNode(form);
    const find = formDOM.querySelector.bind(formDOM);

    // By default, the Country is USA, so the postalCode label should be 'ZIP Code'
    //  and the State label should be 'State' and the field should be a dropdown
    const labels = ReactTestUtils.scryRenderedDOMComponentsWithTag(form, 'label');
    const postalCodeLabel = labels.find(label => label.htmlFor === 'root_postalCode');
    const stateLabel = labels.find(label => label.htmlFor === 'root_state');
    const stateField = formDOM.querySelector('#root_state');

    // Check the labels' text
    expect(postalCodeLabel.textContent === 'ZIP Code');
    expect(stateLabel.textContent === 'State');

    // And state input type / options
    expect(stateField.tagName === 'select');
    // jsdom doesn't support namedItem; use options instead
    expect(Array.from(stateField.options).find(op => op.value === 'OR')).to.not.be.undefined;

    // Entering a military city should result in different "state" options
    const cityField = formDOM.querySelector('#root_city');
    ReactTestUtils.Simulate.change(cityField, {
      target: {
        value: 'apo'
      }
    });
    expect(Array.from(stateField.options).find(op => op.value === 'AA')).to.not.be.undefined;

    // Change the country
    const countryField = find('#root_country');

    ReactTestUtils.Simulate.change(countryField, {
      target: {
        value: 'CAN'
      }
    });

    // Check to see if the postal code and state updated
    expect(stateLabel.textContent === 'Provice');
    expect(postalCodeLabel.textContent === 'Postal code');
    expect(Array.from(stateField.options).find(op => op.value === 'QC')).to.not.be.undefined;

    // Check for Mexican states
    ReactTestUtils.Simulate.change(countryField, {
      target: {
        value: 'MEX'
      }
    });
    expect(Array.from(stateField.options).find(op => op.value === 'guerrero')).to.not.be.undefined;

    // Change to another country that doesn't have a select box for state
    ReactTestUtils.Simulate.change(countryField, {
      target: {
        value: 'BEL'
      }
    });

    expect(stateField.tagName === 'input');
  }).timeout(4000);

  it('should update address field', () => {
    const s = schema(addressSchema, false);
    const uis = uiSchema();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={s}
        uiSchema={uis}/>
    );

    const formDOM = findDOMNode(form);

    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_street'), {
      target: {
        value: '123 street'
      }
    });

    expect(formDOM.querySelector('#root_street').value).to.equal('123 street');
  }).timeout(4000);

  it('should update country field in empty address', () => {
    const s = schema(addressSchema, false);
    const uis = uiSchema();
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={s}
        uiSchema={uis}/>
    );

    const formDOM = findDOMNode(form);

    ReactTestUtils.Simulate.change(formDOM.querySelector('#root_country'), {
      target: {
        value: 'CAN'
      }
    });

    expect(formDOM.querySelector('#root_country').value).to.equal('CAN');
  }).timeout(4000);
});
