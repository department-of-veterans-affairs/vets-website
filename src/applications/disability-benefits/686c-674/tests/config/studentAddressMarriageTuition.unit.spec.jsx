import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { changeDropdown } from 'platform/testing/unit/helpers';
import {
  DefinitionTester,
  fillData,
  selectCheckbox,
  selectRadio,
} from 'platform/testing/unit/schemaform-utils';

import formConfig from '../../config/form';

describe('Report 674 student address and marriage information', () => {
  const {
    schema,
    uiSchema,
    updateFormData,
  } = formConfig.chapters.report674.pages.studentAddressMarriageTuition;

  const formData = {
    'view:selectable686Options': {
      report674: true,
    },
    studentAddressMarriageTuition: {
      wasMarried: '',
    },
    studentNameAndSSN: {
      fullName: {
        first: 'John',
        last: 'Doe',
      },
    },
    schoolAddress: {
      countryName: '',
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
    expect(form.find('input').length).to.equal(10);
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
      'select#root_studentAddressMarriageTuition_address_countryName',
      'USA',
    );
    fillData(
      form,
      'input#root_studentAddressMarriageTuition_address_addressLine1',
      '1600',
    );
    fillData(
      form,
      'input#root_studentAddressMarriageTuition_address_city',
      'Washington',
    );
    changeDropdown(
      form,
      'select#root_studentAddressMarriageTuition_address_stateCode',
      'DC',
    );

    // test military base toggle restores the previous city/state
    selectCheckbox(
      form,
      'root_studentAddressMarriageTuition_address_view:livesOnMilitaryBase',
      true,
    );
    changeDropdown(
      form,
      'select#root_studentAddressMarriageTuition_address_city',
      'APO',
    );
    changeDropdown(
      form,
      'select#root_studentAddressMarriageTuition_address_stateCode',
      'AA',
    );
    selectCheckbox(
      form,
      'root_studentAddressMarriageTuition_address_view:livesOnMilitaryBase',
      false,
    );
    // test end

    fillData(
      form,
      'input#root_studentAddressMarriageTuition_address_zipCode',
      '20500',
    );
    selectRadio(form, 'root_studentAddressMarriageTuition_wasMarried', 'N');
    selectRadio(
      form,
      'root_studentAddressMarriageTuition_tuitionIsPaidByGovAgency',
      'N',
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
      'root_studentAddressMarriageTuition_address_view:livesOnMilitaryBase',
      true,
    );
    fillData(
      form,
      'input#root_studentAddressMarriageTuition_address_addressLine1',
      '1600',
    );
    changeDropdown(
      form,
      'select#root_studentAddressMarriageTuition_address_city',
      'APO',
    );
    changeDropdown(
      form,
      'select#root_studentAddressMarriageTuition_address_stateCode',
      'AA',
    );
    fillData(
      form,
      'input#root_studentAddressMarriageTuition_address_zipCode',
      '34012',
    );
    selectRadio(form, 'root_studentAddressMarriageTuition_wasMarried', 'N');
    selectRadio(
      form,
      'root_studentAddressMarriageTuition_tuitionIsPaidByGovAgency',
      'N',
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
      'select#root_studentAddressMarriageTuition_address_countryName',
      'BRA',
    );
    fillData(
      form,
      'input#root_studentAddressMarriageTuition_address_addressLine1',
      '1600',
    );
    fillData(
      form,
      'input#root_studentAddressMarriageTuition_address_city',
      'Rio de Janeiro',
    );
    fillData(
      form,
      'input#root_studentAddressMarriageTuition_address_internationalPostalCode',
      '12345',
    );
    selectRadio(form, 'root_studentAddressMarriageTuition_wasMarried', 'N');
    selectRadio(
      form,
      'root_studentAddressMarriageTuition_tuitionIsPaidByGovAgency',
      'N',
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should submit with a valid domestic US address, marriage, and tuition information', () => {
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
      'select#root_studentAddressMarriageTuition_address_countryName',
      'USA',
    );
    fillData(
      form,
      'input#root_studentAddressMarriageTuition_address_addressLine1',
      '1600',
    );
    fillData(
      form,
      'input#root_studentAddressMarriageTuition_address_city',
      'Washington',
    );
    changeDropdown(
      form,
      'select#root_studentAddressMarriageTuition_address_stateCode',
      'DC',
    );
    fillData(
      form,
      'input#root_studentAddressMarriageTuition_address_zipCode',
      '20500',
    );
    selectRadio(form, 'root_studentAddressMarriageTuition_wasMarried', 'Y');
    changeDropdown(
      form,
      'select#root_studentAddressMarriageTuition_marriageDateMonth',
      1,
    );
    changeDropdown(
      form,
      'select#root_studentAddressMarriageTuition_marriageDateDay',
      1,
    );
    fillData(
      form,
      'input#root_studentAddressMarriageTuition_marriageDateYear',
      2010,
    );
    selectRadio(
      form,
      'root_studentAddressMarriageTuition_tuitionIsPaidByGovAgency',
      'Y',
    );
    fillData(
      form,
      'input#root_studentAddressMarriageTuition_agencyName',
      'FBI',
    );
    changeDropdown(
      form,
      'select#root_studentAddressMarriageTuition_datePaymentsBeganMonth',
      1,
    );
    changeDropdown(
      form,
      'select#root_studentAddressMarriageTuition_datePaymentsBeganDay',
      1,
    );
    fillData(
      form,
      'input#root_studentAddressMarriageTuition_datePaymentsBeganYear',
      2010,
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
      'root_studentAddressMarriageTuition_address_view:livesOnMilitaryBase',
      false,
    );
    changeDropdown(
      form,
      'select#root_studentAddressMarriageTuition_address_countryName',
      'USA',
    );
    fillData(
      form,
      'input#root_studentAddressMarriageTuition_address_addressLine1',
      '1600',
    );
    fillData(
      form,
      'input#root_studentAddressMarriageTuition_address_city',
      'APO',
    );
    changeDropdown(
      form,
      'select#root_studentAddressMarriageTuition_address_stateCode',
      'DC',
    );
    fillData(
      form,
      'input#root_studentAddressMarriageTuition_address_zipCode',
      '20500',
    );
    selectRadio(form, 'root_studentAddressMarriageTuition_wasMarried', 'Y');
    changeDropdown(
      form,
      'select#root_studentAddressMarriageTuition_marriageDateMonth',
      1,
    );
    changeDropdown(
      form,
      'select#root_studentAddressMarriageTuition_marriageDateDay',
      1,
    );
    fillData(
      form,
      'input#root_studentAddressMarriageTuition_marriageDateYear',
      2010,
    );
    selectRadio(
      form,
      'root_studentAddressMarriageTuition_tuitionIsPaidByGovAgency',
      'Y',
    );
    fillData(
      form,
      'input#root_studentAddressMarriageTuition_agencyName',
      'FBI',
    );
    changeDropdown(
      form,
      'select#root_studentAddressMarriageTuition_datePaymentsBeganMonth',
      1,
    );
    changeDropdown(
      form,
      'select#root_studentAddressMarriageTuition_datePaymentsBeganDay',
      1,
    );
    fillData(
      form,
      'input#root_studentAddressMarriageTuition_datePaymentsBeganYear',
      2010,
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').text()).to.include(
      'For APO addresses, check the "They receive mail outside of the United States on a U.S. military base" checkbox. If you live on a military base in the United States, enter your city.',
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
      />,
    );
    selectCheckbox(
      form,
      'root_studentAddressMarriageTuition_address_view:livesOnMilitaryBase',
      true,
    );
    changeDropdown(
      form,
      'select#root_studentAddressMarriageTuition_address_countryName',
      'USA',
    );
    fillData(
      form,
      'input#root_studentAddressMarriageTuition_address_addressLine1',
      '1600',
    );
    changeDropdown(
      form,
      'select#root_studentAddressMarriageTuition_address_city',
      'APO',
    );
    changeDropdown(
      form,
      'select#root_studentAddressMarriageTuition_address_stateCode',
      'AE',
    );
    fillData(
      form,
      'input#root_studentAddressMarriageTuition_address_zipCode',
      '09123',
    );
    selectRadio(form, 'root_studentAddressMarriageTuition_wasMarried', 'Y');
    changeDropdown(
      form,
      'select#root_studentAddressMarriageTuition_marriageDateMonth',
      1,
    );
    changeDropdown(
      form,
      'select#root_studentAddressMarriageTuition_marriageDateDay',
      1,
    );
    fillData(
      form,
      'input#root_studentAddressMarriageTuition_marriageDateYear',
      2010,
    );
    selectRadio(
      form,
      'root_studentAddressMarriageTuition_tuitionIsPaidByGovAgency',
      'Y',
    );
    fillData(
      form,
      'input#root_studentAddressMarriageTuition_agencyName',
      'FBI',
    );
    changeDropdown(
      form,
      'select#root_studentAddressMarriageTuition_datePaymentsBeganMonth',
      1,
    );
    changeDropdown(
      form,
      'select#root_studentAddressMarriageTuition_datePaymentsBeganDay',
      1,
    );
    fillData(
      form,
      'input#root_studentAddressMarriageTuition_datePaymentsBeganYear',
      2010,
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
