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

describe('Report 674 term information', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.report674.pages.studentTermDates;

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
    expect(form.find('input')).to.have.lengthOf.within(5, 6);
    expect(form.find('select').length).to.equal(6);
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
    expect(form.find('.usa-input-error').length).to.equal(4);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should submit with valid term dates and full-time enrollment', () => {
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
      'select#root_currentTermDates_officialSchoolStartDateMonth',
      1,
    );
    changeDropdown(
      form,
      'select#root_currentTermDates_officialSchoolStartDateDay',
      1,
    );
    fillData(
      form,
      'input#root_currentTermDates_officialSchoolStartDateYear',
      2010,
    );
    changeDropdown(
      form,
      'select#root_currentTermDates_expectedStudentStartDateMonth',
      1,
    );
    changeDropdown(
      form,
      'select#root_currentTermDates_expectedStudentStartDateDay',
      1,
    );
    fillData(
      form,
      'input#root_currentTermDates_expectedStudentStartDateYear',
      2010,
    );
    changeDropdown(
      form,
      'select#root_currentTermDates_expectedGraduationDateMonth',
      1,
    );
    changeDropdown(
      form,
      'select#root_currentTermDates_expectedGraduationDateDay',
      1,
    );
    fillData(
      form,
      'input#root_currentTermDates_expectedGraduationDateYear',
      2010,
    );
    selectRadio(form, 'root_programInformation_studentIsEnrolledFullTime', 'Y');
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should submit with valid term dates and program information', () => {
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
      'select#root_currentTermDates_officialSchoolStartDateMonth',
      1,
    );
    changeDropdown(
      form,
      'select#root_currentTermDates_officialSchoolStartDateDay',
      1,
    );
    fillData(
      form,
      'input#root_currentTermDates_officialSchoolStartDateYear',
      2010,
    );
    changeDropdown(
      form,
      'select#root_currentTermDates_expectedStudentStartDateMonth',
      1,
    );
    changeDropdown(
      form,
      'select#root_currentTermDates_expectedStudentStartDateDay',
      1,
    );
    fillData(
      form,
      'input#root_currentTermDates_expectedStudentStartDateYear',
      2010,
    );
    changeDropdown(
      form,
      'select#root_currentTermDates_expectedGraduationDateMonth',
      1,
    );
    changeDropdown(
      form,
      'select#root_currentTermDates_expectedGraduationDateDay',
      1,
    );
    fillData(
      form,
      'input#root_currentTermDates_expectedGraduationDateYear',
      2010,
    );
    selectRadio(form, 'root_programInformation_studentIsEnrolledFullTime', 'N');
    fillData(
      form,
      'input#root_programInformation_courseOfStudy',
      'Marine Biology',
    );
    fillData(form, 'input#root_programInformation_classesPerWeek', 2);
    fillData(form, 'input#root_programInformation_hoursPerWeek', 2);
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
