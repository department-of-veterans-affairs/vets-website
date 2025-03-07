import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import {
  DefinitionTester,
  fillData,
} from 'platform/testing/unit/schemaform-utils.jsx';
import { changeDropdown } from 'platform/testing/unit/helpers';
import formConfig from '../../config/form';

describe('686 report a child has stopped attending school', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.reportChildStoppedAttendingSchool.pages.childNoLongerInSchool;

  const formData = {
    'view:selectable686Options': {
      reportChild18OrOlderIsNotAttendingSchool: true,
    },
  };

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
        definitions={formConfig.defaultDefinitions}
      />,
    );
    expect(form.find('input').length).to.equal(8);
    form.unmount();
  });

  it('should not submit an empty form', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
      />,
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(5);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  // empty last name
  it('should not submit a form with an incomplete name', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
        definitions={formConfig.defaultDefinitions}
      />,
    );
    fillData(
      form,
      'input#root_childStoppedAttendingSchool_fullName_first',
      'john',
    );
    fillData(form, 'input#root_childStoppedAttendingSchool_ssn', '123211234');
    changeDropdown(
      form,
      'select#root_childStoppedAttendingSchool_birthDateMonth',
      1,
    );
    changeDropdown(
      form,
      'select#root_childStoppedAttendingSchool_birthDateDay',
      1,
    );
    fillData(
      form,
      'input#root_childStoppedAttendingSchool_birthDateYear',
      '2010',
    );
    const month = form.find(
      'select#root_childStoppedAttendingSchool_dateChildLeftSchoolMonth',
    );
    const day = form.find(
      'select#root_childStoppedAttendingSchool_dateChildLeftSchoolDay',
    );
    month.simulate('change', {
      target: { value: '1' },
    });
    day.simulate('change', {
      target: { value: '1' },
    });
    fillData(
      form,
      'input#root_childStoppedAttendingSchool_dateChildLeftSchoolYear',
      '2010',
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  // empty date
  it('should not submit a form without a date', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
      />,
    );
    fillData(
      form,
      'input#root_childStoppedAttendingSchool_fullName_first',
      'john',
    );
    fillData(
      form,
      'input#root_childStoppedAttendingSchool_fullName_last',
      'doe',
    );
    fillData(form, 'input#root_childStoppedAttendingSchool_ssn', '123211234');
    changeDropdown(
      form,
      'select#root_childStoppedAttendingSchool_birthDateMonth',
      1,
    );
    changeDropdown(
      form,
      'select#root_childStoppedAttendingSchool_birthDateDay',
      1,
    );
    fillData(
      form,
      'input#root_childStoppedAttendingSchool_birthDateYear',
      '2010',
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should submit a valid form without a suffix or middle name', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
      />,
    );
    fillData(
      form,
      'input#root_childStoppedAttendingSchool_fullName_first',
      'john',
    );
    fillData(
      form,
      'input#root_childStoppedAttendingSchool_fullName_last',
      'doe',
    );
    fillData(form, 'input#root_childStoppedAttendingSchool_ssn', '123211234');
    changeDropdown(
      form,
      'select#root_childStoppedAttendingSchool_birthDateMonth',
      1,
    );
    changeDropdown(
      form,
      'select#root_childStoppedAttendingSchool_birthDateDay',
      1,
    );
    fillData(
      form,
      'input#root_childStoppedAttendingSchool_birthDateYear',
      '2010',
    );
    const month = form.find(
      'select#root_childStoppedAttendingSchool_dateChildLeftSchoolMonth',
    );
    const day = form.find(
      'select#root_childStoppedAttendingSchool_dateChildLeftSchoolDay',
    );
    month.simulate('change', {
      target: { value: '1' },
    });
    day.simulate('change', {
      target: { value: '1' },
    });
    fillData(
      form,
      'input#root_childStoppedAttendingSchool_dateChildLeftSchoolYear',
      '2010',
    );
    form.find('form').simulate('submit');
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should submit a valid form with a suffix and middle name', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
      />,
    );
    fillData(
      form,
      'input#root_childStoppedAttendingSchool_fullName_first',
      'john',
    );
    fillData(
      form,
      'input#root_childStoppedAttendingSchool_fullName_middle',
      'jeffrey',
    );
    fillData(
      form,
      'input#root_childStoppedAttendingSchool_fullName_last',
      'doe',
    );
    fillData(form, 'input#root_childStoppedAttendingSchool_ssn', '123211234');
    changeDropdown(
      form,
      'select#root_childStoppedAttendingSchool_birthDateMonth',
      1,
    );
    changeDropdown(
      form,
      'select#root_childStoppedAttendingSchool_birthDateDay',
      1,
    );
    fillData(
      form,
      'input#root_childStoppedAttendingSchool_birthDateYear',
      '2010',
    );
    const month = form.find(
      'select#root_childStoppedAttendingSchool_dateChildLeftSchoolMonth',
    );
    const day = form.find(
      'select#root_childStoppedAttendingSchool_dateChildLeftSchoolDay',
    );
    month.simulate('change', {
      target: { value: '1' },
    });
    day.simulate('change', {
      target: { value: '1' },
    });
    fillData(
      form,
      'input#root_childStoppedAttendingSchool_dateChildLeftSchoolYear',
      '2010',
    );
    form.find('form').simulate('submit');
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
