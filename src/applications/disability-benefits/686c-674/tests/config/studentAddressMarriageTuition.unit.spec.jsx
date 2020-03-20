import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { changeDropdown } from '../helpers/index.js';
import {
  DefinitionTester,
  fillData,
  selectCheckbox,
  selectRadio,
} from 'platform/testing/unit/schemaform-utils.jsx';

import formConfig from '../../config/form';

describe('Report 674 student address and marriage information', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.report674.pages.studentAddressMarriageTuition;

  const formData = {
    'view:selectable686Options': {
      report674: true,
    },
    studentFullName: {
      first: 'John',
      last: 'Doe',
    },
    studentAddress: {
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
    expect(form.find('input').length).to.equal(11);
    expect(form.find('select').length).to.equal(1);
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
    expect(form.find('.usa-input-error').length).to.equal(6);
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
      />,
    );
    changeDropdown(
      form,
      'select#root_studentAddress_countryName',
      'United States',
    );
    fillData(form, 'input#root_studentAddress_addressLine1', '1600');
    fillData(form, 'input#root_studentAddress_city', 'Washington');
    changeDropdown(form, 'select#root_studentAddress_stateCode', 'DC');
    fillData(form, 'input#root_studentAddress_zipCode', '20500');
    selectRadio(form, 'root_studentWasMarried', 'N');
    selectRadio(form, 'root_tuitionIsPaidByGovAgency', 'N');
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
    selectCheckbox(form, 'root_studentAddress_view:livesOnMilitaryBase', true);
    fillData(form, 'input#root_studentAddress_addressLine1', '1600');
    changeDropdown(form, 'select#root_studentAddress_city', 'APO');
    changeDropdown(form, 'select#root_studentAddress_stateCode', 'AA');
    fillData(form, 'input#root_studentAddress_zipCode', '20500');
    selectRadio(form, 'root_studentWasMarried', 'N');
    selectRadio(form, 'root_tuitionIsPaidByGovAgency', 'N');
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
    changeDropdown(form, 'select#root_studentAddress_countryName', 'Brazil');
    fillData(form, 'input#root_studentAddress_addressLine1', '1600');
    fillData(form, 'input#root_studentAddress_city', 'Rio de Janeiro');
    fillData(
      form,
      'input#root_studentAddress_internationalPostalCode',
      '12345',
    );
    selectRadio(form, 'root_studentWasMarried', 'N');
    selectRadio(form, 'root_tuitionIsPaidByGovAgency', 'N');
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
      'select#root_studentAddress_countryName',
      'United States',
    );
    fillData(form, 'input#root_studentAddress_addressLine1', '1600');
    fillData(form, 'input#root_studentAddress_city', 'Washington');
    changeDropdown(form, 'select#root_studentAddress_stateCode', 'DC');
    fillData(form, 'input#root_studentAddress_zipCode', '20500');
    selectRadio(form, 'root_studentWasMarried', 'Y');
    changeDropdown(form, 'select#root_marriageDateMonth', 1);
    changeDropdown(form, 'select#root_marriageDateDay', 1);
    fillData(form, 'input#root_marriageDateYear', 2010);
    selectRadio(form, 'root_tuitionIsPaidByGovAgency', 'Y');
    fillData(form, 'input#root_agencyName', 'FBI');
    changeDropdown(form, 'select#root_datePaymentsBeganMonth', 1);
    changeDropdown(form, 'select#root_datePaymentsBeganDay', 1);
    fillData(form, 'input#root_datePaymentsBeganYear', 2010);
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
