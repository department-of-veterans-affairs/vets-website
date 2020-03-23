import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { changeDropdown } from '../helpers/index.js';
import {
  DefinitionTester,
  fillData,
  selectRadio,
} from 'platform/testing/unit/schemaform-utils.jsx';

import formConfig from '../../config/form';

describe('Report 674 last term information', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.report674.pages.studentLastTerm;

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
    studentDidAttendSchoolLastTerm: '',
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
    expect(form.find('input').length).to.equal(2);
    form.unmount();
  });

  it('should submit if a student did not attend school last term', () => {
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
    selectRadio(form, 'root_studentDidAttendSchoolLastTerm', 'N');
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should submit if a student did attend school last term in the US', () => {
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
    selectRadio(form, 'root_studentDidAttendSchoolLastTerm', 'Y');
    fillData(form, 'input#root_lastTermSchoolName', 'Phoenix Online');
    changeDropdown(
      form,
      'select#root_lastTermSchoolAddress_countryName',
      'United States',
    );
    fillData(form, 'input#root_lastTermSchoolAddress_addressLine1', '1600');
    fillData(form, 'input#root_lastTermSchoolAddress_city', 'Washington');
    changeDropdown(form, 'select#root_lastTermSchoolAddress_stateCode', 'DC');
    fillData(form, 'input#root_lastTermSchoolAddress_zipCode', '20500');
    changeDropdown(form, 'select#root_dateTermBeganMonth', 1);
    changeDropdown(form, 'select#root_dateTermBeganDay', 1);
    fillData(form, 'input#root_dateTermBeganYear', 2009);
    changeDropdown(form, 'select#root_dateTermEndedMonth', 1);
    changeDropdown(form, 'select#root_dateTermEndedDay', 1);
    fillData(form, 'input#root_dateTermEndedYear', 2009);
    fillData(form, 'input#root_lastTermClassesPerWeek', 2);
    fillData(form, 'input#root_lastTermHoursPerWeek', 2);
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should submit if a student did attend school last term abroad', () => {
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
    selectRadio(form, 'root_studentDidAttendSchoolLastTerm', 'Y');
    fillData(form, 'input#root_lastTermSchoolName', 'Phoenix Online');
    changeDropdown(
      form,
      'select#root_lastTermSchoolAddress_countryName',
      'Albania',
    );
    fillData(form, 'input#root_lastTermSchoolAddress_addressLine1', '1600');
    fillData(form, 'input#root_lastTermSchoolAddress_city', 'Albany');
    fillData(
      form,
      'input#root_lastTermSchoolAddress_internationalPostalCode',
      '20500',
    );
    changeDropdown(form, 'select#root_dateTermBeganMonth', 1);
    changeDropdown(form, 'select#root_dateTermBeganDay', 1);
    fillData(form, 'input#root_dateTermBeganYear', 2009);
    changeDropdown(form, 'select#root_dateTermEndedMonth', 1);
    changeDropdown(form, 'select#root_dateTermEndedDay', 1);
    fillData(form, 'input#root_dateTermEndedYear', 2009);
    fillData(form, 'input#root_lastTermClassesPerWeek', 2);
    fillData(form, 'input#root_lastTermHoursPerWeek', 2);
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
