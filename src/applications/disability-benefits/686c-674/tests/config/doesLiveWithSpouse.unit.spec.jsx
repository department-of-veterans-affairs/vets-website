import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { changeDropdown } from 'platform/testing/unit/helpers';
import {
  DefinitionTester,
  fillData,
  selectRadio,
  selectCheckbox,
} from 'platform/testing/unit/schemaform-utils';

import formConfig from '../../config/form';

describe('686 current marriage co-habitation status', () => {
  const {
    schema,
    uiSchema,
    updateFormData,
  } = formConfig.chapters.addSpouse.pages.doesLiveWithSpouse;

  const formData = {
    'view:selectable686Options': {
      addSpouse: true,
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
    expect(form.find('input').length).to.equal(4);
    form.unmount();
  });

  it('should submit when spouse and veteran live together', () => {
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
    selectRadio(form, 'root_doesLiveWithSpouse_spouseDoesLiveWithVeteran', 'Y');
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should require spouse address if they live apart', () => {
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
    selectRadio(form, 'root_doesLiveWithSpouse_spouseDoesLiveWithVeteran', 'N');
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(4);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should submit when spouse lives apart with all necessary information', () => {
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
    selectRadio(form, 'root_doesLiveWithSpouse_spouseDoesLiveWithVeteran', 'N');
    changeDropdown(
      form,
      'select#root_doesLiveWithSpouse_currentSpouseReasonForSeparation',
      'Other',
    );
    changeDropdown(
      form,
      'select#root_doesLiveWithSpouse_address_countryName',
      'USA',
    );
    fillData(
      form,
      'input#root_doesLiveWithSpouse_address_addressLine1',
      '123 Back St',
    );
    fillData(form, 'input#root_doesLiveWithSpouse_address_city', 'SomeCity');
    changeDropdown(
      form,
      'select#root_doesLiveWithSpouse_address_stateCode',
      'AL',
    );

    // test military base toggle restores the previous city/state
    selectCheckbox(
      form,
      'root_doesLiveWithSpouse_address_view:livesOnMilitaryBase',
      true,
    );
    changeDropdown(form, 'select#root_doesLiveWithSpouse_address_city', 'APO');
    changeDropdown(
      form,
      'select#root_doesLiveWithSpouse_address_stateCode',
      'AA',
    );
    selectCheckbox(
      form,
      'root_doesLiveWithSpouse_address_view:livesOnMilitaryBase',
      false,
    );
    // test end

    fillData(form, 'input#root_doesLiveWithSpouse_address_zipCode', '12345');
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
        updateFormData={updateFormData}
      />,
    );
    selectRadio(form, 'root_doesLiveWithSpouse_spouseDoesLiveWithVeteran', 'N');
    changeDropdown(
      form,
      'select#root_doesLiveWithSpouse_currentSpouseReasonForSeparation',
      'Other',
    );
    selectCheckbox(
      form,
      'root_doesLiveWithSpouse_address_view:livesOnMilitaryBase',
      false,
    );
    changeDropdown(
      form,
      'select#root_doesLiveWithSpouse_address_countryName',
      'USA',
    );
    fillData(
      form,
      'input#root_doesLiveWithSpouse_address_addressLine1',
      '123 Back St',
    );
    fillData(form, 'input#root_doesLiveWithSpouse_address_city', 'DPO');
    changeDropdown(
      form,
      'select#root_doesLiveWithSpouse_address_stateCode',
      'AL',
    );
    fillData(form, 'input#root_doesLiveWithSpouse_address_zipCode', '12345');

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').text()).to.include(
      'For DPO addresses, check the "They receive mail outside of the United States on a U.S. military base" checkbox. If you live on a military base in the United States, enter your city.',
    );
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should not display an error if the veteran lists APO, FPO, or DPO as their city and checks the military base checkbox', () => {
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
    selectRadio(form, 'root_doesLiveWithSpouse_spouseDoesLiveWithVeteran', 'N');
    changeDropdown(
      form,
      'select#root_doesLiveWithSpouse_currentSpouseReasonForSeparation',
      'Other',
    );
    selectCheckbox(
      form,
      'root_doesLiveWithSpouse_address_view:livesOnMilitaryBase',
      true,
    );
    changeDropdown(
      form,
      'select#root_doesLiveWithSpouse_address_countryName',
      'USA',
    );
    fillData(
      form,
      'input#root_doesLiveWithSpouse_address_addressLine1',
      '123 Back St',
    );
    changeDropdown(form, 'select#root_doesLiveWithSpouse_address_city', 'DPO');
    changeDropdown(
      form,
      'select#root_doesLiveWithSpouse_address_stateCode',
      'AA',
    );
    fillData(form, 'input#root_doesLiveWithSpouse_address_zipCode', '34012');

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
