import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { changeDropdown } from 'platform/testing/unit/helpers';
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
    studentNameAndSSN: {
      fullName: {
        first: 'John',
        last: 'Doe',
      },
    },
    studentAddressMarriageTuition: {
      address: {
        countryName: '',
      },
    },
    programInformation: {
      studentIsEnrolledFullTime: '',
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
    changeDropdown(
      form,
      'select#root_lastTermSchoolInformation_termBeginMonth',
      1,
    );
    changeDropdown(
      form,
      'select#root_lastTermSchoolInformation_termBeginDay',
      1,
    );
    fillData(form, 'input#root_lastTermSchoolInformation_termBeginYear', 2009);
    changeDropdown(
      form,
      'select#root_lastTermSchoolInformation_dateTermEndedMonth',
      1,
    );
    changeDropdown(
      form,
      'select#root_lastTermSchoolInformation_dateTermEndedDay',
      1,
    );
    fillData(
      form,
      'input#root_lastTermSchoolInformation_dateTermEndedYear',
      2009,
    );
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
    changeDropdown(
      form,
      'select#root_lastTermSchoolInformation_termBeginMonth',
      1,
    );
    changeDropdown(
      form,
      'select#root_lastTermSchoolInformation_termBeginDay',
      1,
    );
    fillData(form, 'input#root_lastTermSchoolInformation_termBeginYear', 2009);
    changeDropdown(
      form,
      'select#root_lastTermSchoolInformation_dateTermEndedMonth',
      1,
    );
    changeDropdown(
      form,
      'select#root_lastTermSchoolInformation_dateTermEndedDay',
      1,
    );
    fillData(
      form,
      'input#root_lastTermSchoolInformation_dateTermEndedYear',
      2009,
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
