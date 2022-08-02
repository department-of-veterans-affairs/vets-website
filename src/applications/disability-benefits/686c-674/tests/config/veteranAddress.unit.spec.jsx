import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { changeDropdown } from 'platform/testing/unit/helpers';
import {
  DefinitionTester,
  fillData,
  selectCheckbox,
} from 'platform/testing/unit/schemaform-utils';

import formConfig from '../../config/form';

describe('Veteran address', () => {
  const {
    schema,
    uiSchema,
    updateFormData,
  } = formConfig.chapters.veteranInformation.pages.veteranAddress;

  const formData = {
    veteranContactInformation: {
      veteranAddress: {
        countryName: 'USA',
        addressLine1: '',
        city: '',
        stateCode: '',
        zipCode: '',
      },
      phoneNumber: '',
    },
  };

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={formData}
      />,
    );
    expect(form.find('input').length).to.equal(8);
    expect(form.find('select').length).to.equal(2);
    form.unmount();
  });

  it('should not progress without the required fields', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={formData}
        onSubmit={onSubmit}
      />,
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(5);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should submit with a valid domestic US address', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={formData}
        onSubmit={onSubmit}
        updateFormData={updateFormData}
      />,
    );
    changeDropdown(
      form,
      'select#root_veteranContactInformation_veteranAddress_countryName',
      'USA',
    );
    fillData(
      form,
      'input#root_veteranContactInformation_veteranAddress_addressLine1',
      '1600',
    );
    fillData(
      form,
      'input#root_veteranContactInformation_veteranAddress_city',
      'Washington',
    );
    changeDropdown(
      form,
      'select#root_veteranContactInformation_veteranAddress_stateCode',
      'DC',
    );

    // test military base toggle restores the previous city/state
    selectCheckbox(
      form,
      'root_veteranContactInformation_veteranAddress_view:livesOnMilitaryBase',
      true,
    );
    changeDropdown(
      form,
      'select#root_veteranContactInformation_veteranAddress_city',
      'APO',
    );
    changeDropdown(
      form,
      'select#root_veteranContactInformation_veteranAddress_stateCode',
      'AA',
    );
    selectCheckbox(
      form,
      'root_veteranContactInformation_veteranAddress_view:livesOnMilitaryBase',
      false,
    );
    // test end

    fillData(
      form,
      'input#root_veteranContactInformation_veteranAddress_zipCode',
      '20500',
    );
    fillData(
      form,
      'input#root_veteranContactInformation_phoneNumber',
      '8005551212',
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should submit with a valid US military base address', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={formData}
        onSubmit={onSubmit}
      />,
    );
    selectCheckbox(
      form,
      'root_veteranContactInformation_veteranAddress_view:livesOnMilitaryBase',
      true,
    );
    fillData(
      form,
      'input#root_veteranContactInformation_veteranAddress_addressLine1',
      '1600',
    );
    changeDropdown(
      form,
      'select#root_veteranContactInformation_veteranAddress_city',
      'APO',
    );
    changeDropdown(
      form,
      'select#root_veteranContactInformation_veteranAddress_stateCode',
      'AA',
    );
    fillData(
      form,
      'input#root_veteranContactInformation_veteranAddress_zipCode',
      '20500',
    );
    fillData(
      form,
      'input#root_veteranContactInformation_phoneNumber',
      '8005551212',
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should submit with a valid international address', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={formData}
        onSubmit={onSubmit}
      />,
    );
    changeDropdown(
      form,
      'select#root_veteranContactInformation_veteranAddress_countryName',
      'BRA',
    );
    fillData(
      form,
      'input#root_veteranContactInformation_veteranAddress_addressLine1',
      '1600',
    );
    fillData(
      form,
      'input#root_veteranContactInformation_veteranAddress_city',
      'Rio de Janeiro',
    );
    fillData(
      form,
      'input#root_veteranContactInformation_veteranAddress_internationalPostalCode',
      '12345',
    );
    fillData(
      form,
      'input#root_veteranContactInformation_phoneNumber',
      '8005551212',
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should submit with a valid domestic US address and phone number', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={formData}
        onSubmit={onSubmit}
      />,
    );
    changeDropdown(
      form,
      'select#root_veteranContactInformation_veteranAddress_countryName',
      'USA',
    );
    fillData(
      form,
      'input#root_veteranContactInformation_veteranAddress_addressLine1',
      '1600',
    );
    fillData(
      form,
      'input#root_veteranContactInformation_veteranAddress_city',
      'Washington',
    );
    changeDropdown(
      form,
      'select#root_veteranContactInformation_veteranAddress_stateCode',
      'DC',
    );
    fillData(
      form,
      'input#root_veteranContactInformation_veteranAddress_zipCode',
      '20500',
    );
    fillData(
      form,
      'input#root_veteranContactInformation_phoneNumber',
      '8005551212',
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
