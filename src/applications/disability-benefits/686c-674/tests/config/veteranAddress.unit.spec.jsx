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
      '34012',
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

  it('should display an error if the veteran lists APO, FPO, or DPO as their city, but does not check the military base checkbox', () => {
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
      false,
    );
    fillData(
      form,
      'input#root_veteranContactInformation_veteranAddress_addressLine1',
      '1600',
    );
    fillData(
      form,
      'input#root_veteranContactInformation_veteranAddress_city',
      'APO',
    );
    changeDropdown(
      form,
      'select#root_veteranContactInformation_veteranAddress_stateCode',
      'AL',
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
    expect(form.find('.usa-input-error').text()).to.include(
      'For APO addresses, check the "I receive mail outside of the United States on a U.S. military base" checkbox. If you live on a military base in the United States, enter your city.',
    );
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should not display an error if the veteran lists APO, FPO, or DPO as their city and checks the military base checkbox while providing a valid AE zip code', () => {
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
      'AE',
    );
    fillData(
      form,
      'input#root_veteranContactInformation_veteranAddress_zipCode',
      '09123',
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

  it('should display an error if the veteran lists APO, FPO, or DPO as their city and checks the military base checkbox while providing an invalid zip code for the AE state selection', () => {
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
      'AE',
    );
    fillData(
      form,
      'input#root_veteranContactInformation_veteranAddress_zipCode',
      '34011',
    );
    fillData(
      form,
      'input#root_veteranContactInformation_phoneNumber',
      '8005551212',
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').text()).to.include(
      'Your address is on a military base outside of the United States. Please provide an APO/FPO/DPO postal code.',
    );
    expect(onSubmit.called).to.be.false;
    fillData(
      form,
      'input#root_veteranContactInformation_veteranAddress_zipCode',
      '91211',
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').text()).to.include(
      'Your address is on a military base outside of the United States. Please provide an APO/FPO/DPO postal code.',
    );
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should display an error if the veteran lists APO, FPO, or DPO as their city and checks the military base checkbox while providing an invalid zip code for the AA state selection', () => {
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
      '09111',
    );
    fillData(
      form,
      'input#root_veteranContactInformation_phoneNumber',
      '8005551212',
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').text()).to.include(
      'Your address is on a military base outside of the United States. Please provide an APO/FPO/DPO postal code.',
    );
    expect(onSubmit.called).to.be.false;
    fillData(
      form,
      'input#root_veteranContactInformation_veteranAddress_zipCode',
      '91311',
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').text()).to.include(
      'Your address is on a military base outside of the United States. Please provide an APO/FPO/DPO postal code.',
    );
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should display an error if the veteran lists APO, FPO, or DPO as their city and checks the military base checkbox while providing an invalid zip code for the AP state selection', () => {
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
      'AP',
    );
    fillData(
      form,
      'input#root_veteranContactInformation_veteranAddress_zipCode',
      '34011',
    );
    fillData(
      form,
      'input#root_veteranContactInformation_phoneNumber',
      '8005551212',
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').text()).to.include(
      'Your address is on a military base outside of the United States. Please provide an APO/FPO/DPO postal code.',
    );
    expect(onSubmit.called).to.be.false;
    fillData(
      form,
      'input#root_veteranContactInformation_veteranAddress_zipCode',
      '09123',
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').text()).to.include(
      'Your address is on a military base outside of the United States. Please provide an APO/FPO/DPO postal code.',
    );
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should display an error if the veteran checks the military base checkbox while providing a domestic zip code before selecting APO/FPO/DPO or state', () => {
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
    fillData(
      form,
      'input#root_veteranContactInformation_veteranAddress_zipCode',
      '04102',
    );
    fillData(
      form,
      'input#root_veteranContactInformation_phoneNumber',
      '8005551212',
    );
    form.find('form').simulate('submit');
    expect(
      form
        .find(
          '#root_veteranContactInformation_veteranAddress_zipCode-error-message',
        )
        .text(),
    ).to.include(
      'This postal code is within the United States. If your mailing address is in the United States, uncheck the checkbox “I receive mail outside of the United States on a U.S. military base.” If your mailing address is an AFO/FPO/DPO address, enter the postal code for the military base.',
    );
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });
});
