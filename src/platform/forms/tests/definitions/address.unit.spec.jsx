import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import { render, waitFor, fireEvent } from '@testing-library/react';

import definitions from 'vets-json-schema/dist/definitions.json';
import {
  DefinitionTester,
  fillData,
} from '../../../testing/unit/schemaform-utils';
import {
  schema,
  uiSchema,
  requireStateWithCountry,
  requireStateWithData,
} from '../../definitions/address';

const { address } = definitions;
const addressSchema = {
  definitions: {
    address,
  },
};
const mouseClick = new MouseEvent('click', {
  bubbles: true,
  cancelable: true,
});

describe('Forms library address definition', () => {
  it('should render address', () => {
    const s = schema(addressSchema, false);
    const uis = uiSchema();
    const form = mount(<DefinitionTester schema={s} uiSchema={uis} />);

    // Count the form elements
    const inputs = form.find('input');
    const selects = form.find('select');
    expect(inputs.length).to.equal(4);
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

    const street = form.container.querySelector('input#root_street');
    fireEvent.change(street, { target: { value: '123 st' } });
    const city = form.container.querySelector('input#root_city');
    fireEvent.change(city, { target: { value: 'Northampton' } });
    const zip = form.container.querySelector('input#root_postalCode');
    fireEvent.change(zip, { target: { value: '12345' } });

    const submitButton = form.getByRole('button', { name: 'Submit' });

    fireEvent(submitButton, mouseClick);

    await waitFor(() => {
      const errors = form.container.querySelectorAll(
        '.usa-input-error-message',
      );
      expect(Array.from(errors).length).to.equal(0);
    });
  });

  it('should not require state for non-required addresses with no other info', async () => {
    const s = schema(addressSchema, false);
    const uis = uiSchema();
    const form = render(<DefinitionTester schema={s} uiSchema={uis} />);

    const submitButton = form.getByRole('button', { name: 'Submit' });

    fireEvent(submitButton, mouseClick);

    await waitFor(() => {
      const errors = form.container.querySelectorAll(
        '.usa-input-error-message',
      );
      expect(Array.from(errors).length).to.equal(0);
    });
  });

  it('should require state if the country requires it', async () => {
    const s = schema(addressSchema, true);
    const uis = uiSchema();
    const form = render(<DefinitionTester schema={s} uiSchema={uis} />);

    const country = form.container.querySelector('select#root_country');
    fireEvent.change(country, { target: { value: 'USA' } });

    const street = form.container.querySelector('input#root_street');
    fireEvent.change(street, { target: { value: '123 st' } });
    const city = form.container.querySelector('input#root_city');
    fireEvent.change(city, { target: { value: 'Northampton' } });
    const zip = form.container.querySelector('input#root_postalCode');
    fireEvent.change(zip, { target: { value: '12345' } });

    const submitButton = form.getByRole('button', { name: 'Submit' });

    fireEvent(submitButton, mouseClick);

    await waitFor(() => {
      form.getByText('Error Please enter a state');
    });
  });
});

describe('Forms library address validation', () => {
  describe('requireStateWithCountry', () => {
    const validationTest = (requiredFields, country, errorFound) => {
      const s = schema(addressSchema, requiredFields);
      const addressData = { country, state: undefined };
      const errors = {
        state: {
          addError: sinon.spy(),
        },
      };
      requireStateWithCountry(errors, addressData, {}, s);
      expect(
        errors.state.addError.calledWith('Please select a state or province'),
      ).to.equal(errorFound);
    };

    it('should require the state when the country requires it', () => {
      validationTest(true, 'USA', true);
    });
    it('should not require the state when the country does not require it', () => {
      validationTest(true, 'ASD', false);
    });
    it('should not require the state when the country is not required', () => {
      validationTest(false, 'USA', false);
    });
  });

  describe('requireStateWithData', () => {
    const validationTest = (requiredFields, dataEntered, errorFound) => {
      const s = schema(addressSchema, requiredFields);
      const errors = {
        state: {
          addError: sinon.spy(),
        },
      };
      requireStateWithData(errors, dataEntered, {}, s);
      expect(
        errors.state.addError.calledWith(
          'Please enter a state or province, or remove other address information.',
        ),
      ).to.equal(errorFound);
    };

    it('should require the state when the country requires it and other data is entered', () => {
      validationTest(
        false,
        {
          country: 'USA',
          postalCode: '12345',
          street: '123 main',
          city: 'Big City',
        },
        true,
      );
    });
    it('should not require the state when the country requires it and other data is not entered', () => {
      validationTest(false, { country: 'USA' }, false);
    });
    it('should not require the state when the country does not require it', () => {
      validationTest(
        false,
        {
          country: 'ASD',
          postalCode: '12345',
          street: '123 main',
          city: 'Big City',
        },
        false,
      );
    });
    it('should not require the state when the schema has required fields', () => {
      validationTest(
        true,
        {
          country: 'USA',
          postalCode: '12345',
          street: '123 main',
          city: 'Big City',
        },
        false,
      );
    });
  });
});
