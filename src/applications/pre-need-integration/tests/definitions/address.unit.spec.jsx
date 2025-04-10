import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import {
  DefinitionTester,
  fillData,
} from 'platform/testing/unit/schemaform-utils.jsx';
import definitions from 'vets-json-schema/dist/definitions.json';
import { schema, uiSchema } from '../../definitions/address';

const { address } = definitions;
const addressSchema = {
  definitions: {
    address,
  },
};

describe('Pre-need definition address', () => {
  it('should render address', () => {
    const s = schema(addressSchema, false);
    const uis = uiSchema();
    const form = mount(<DefinitionTester schema={s} uiSchema={uis} />);

    const inputs = form.find('input');
    const selects = form.find('select');
    expect(inputs.length).to.equal(4);
    expect(selects.length).to.equal(2);

    expect(inputs.last().is('.usa-input-medium')).to.be.true;
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

    expect(postalCodeLabel.text()).to.equal('Postal code');
    expect(stateLabel.text()).to.equal('State');
    expect(stateField.find('option').someWhere(n => n.props().value === 'OR'))
      .to.be.true;

    fillData(form, 'input#root_city', 'apo');
    expect(stateField.find('option').someWhere(n => n.props().value === 'AA'))
      .to.be.true;

    fillData(form, 'select#root_country', 'CAN');

    expect(stateLabel.text()).to.equal('Province');
    expect(postalCodeLabel.text()).to.equal('Postal code');
    expect(
      form
        .find('select#root_state')
        .find('option')
        .someWhere(n => n.props().value === 'QC'),
    ).to.be.true;

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

  it('should require state for non-required addresses with other info', () => {
    const s = schema(addressSchema, false);
    const uis = uiSchema();
    const form = mount(<DefinitionTester schema={s} uiSchema={uis} />);

    fillData(form, 'input#root_street', '123 st');
    fillData(form, 'input#root_city', 'Northampton');
    fillData(form, 'input#root_postalCode', '12345');

    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error-message').length).to.equal(1);
    form.unmount();
  }).timeout(4000);

  it('should show error for invalid US ZIP', () => {
    const s = schema(addressSchema, false);
    const uis = uiSchema();
    const form = mount(<DefinitionTester schema={s} uiSchema={uis} />);

    fillData(form, 'input#root_postalCode', 'abcde');
    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error-message').text()).to.include(
      'valid postal code',
    );
    form.unmount();
  }).timeout(4000);

  it('should show error for invalid CAN postal code', () => {
    const s = schema(addressSchema, false);
    const uis = uiSchema();
    const form = mount(<DefinitionTester schema={s} uiSchema={uis} />);

    fillData(form, 'select#root_country', 'CAN');
    fillData(form, 'input#root_postalCode', '12345');
    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error-message').text()).to.include(
      'valid postal code',
    );
    form.unmount();
  }).timeout(4000);

  it('should show error when street is all whitespace', () => {
    const s = schema(addressSchema, true);
    const uis = uiSchema();
    const form = mount(<DefinitionTester schema={s} uiSchema={uis} />);

    fillData(form, 'input#root_street', '     ');
    form.find('form').simulate('submit');

    expect(
      form
        .find('.usa-input-error-message')
        .someWhere(n => n.text().includes('provide a response')),
    ).to.be.true;
    form.unmount();
  }).timeout(4000);
});
