import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { changeDropdown } from 'platform/testing/unit/helpers';
import {
  DefinitionTester,
  fillData,
} from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form';

describe('686 report the marriage of a child', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.reportChildMarriage.pages.childInformation;

  const formData = {
    'view:selectable686Options': {
      reportMarriageOfChildUnder18: true,
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
    form.unmount();
  });

  it('should not submit an empty form', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        data={formData}
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
        definitions={formConfig.defaultDefinitions}
        data={formData}
      />,
    );
    fillData(form, 'input#root_childMarriage_fullName_first', 'john');
    const month = form.find('select#root_childMarriage_dateMarriedMonth');
    const day = form.find('select#root_childMarriage_dateMarriedDay');
    fillData(form, 'input#root_childMarriage_ssn', '123211234');
    changeDropdown(form, 'select#root_childMarriage_birthDateMonth', 1);
    changeDropdown(form, 'select#root_childMarriage_birthDateDay', 1);
    fillData(form, 'input#root_childMarriage_birthDateYear', '2010');
    month.simulate('change', {
      target: { value: '1' },
    });
    day.simulate('change', {
      target: { value: '1' },
    });
    fillData(form, 'input#root_childMarriage_dateMarriedYear', '2010');
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
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        data={formData}
      />,
    );
    fillData(form, 'input#root_childMarriage_fullName_first', 'john');
    fillData(form, 'input#root_childMarriage_fullName_last', 'doe');
    fillData(form, 'input#root_childMarriage_ssn', '123211234');
    changeDropdown(form, 'select#root_childMarriage_birthDateMonth', 1);
    changeDropdown(form, 'select#root_childMarriage_birthDateDay', 1);
    fillData(form, 'input#root_childMarriage_birthDateYear', '2010');
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
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        data={formData}
      />,
    );
    fillData(form, 'input#root_childMarriage_fullName_first', 'john');
    fillData(form, 'input#root_childMarriage_fullName_last', 'doe');
    fillData(form, 'input#root_childMarriage_ssn', '123211234');
    changeDropdown(form, 'select#root_childMarriage_birthDateMonth', 1);
    changeDropdown(form, 'select#root_childMarriage_birthDateDay', 1);
    fillData(form, 'input#root_childMarriage_birthDateYear', '2010');
    const month = form.find('select#root_childMarriage_dateMarriedMonth');
    const day = form.find('select#root_childMarriage_dateMarriedDay');
    month.simulate('change', {
      target: { value: '1' },
    });
    day.simulate('change', {
      target: { value: '1' },
    });
    fillData(form, 'input#root_childMarriage_dateMarriedYear', '2010');
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
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        data={formData}
      />,
    );
    fillData(form, 'input#root_childMarriage_fullName_first', 'john');
    fillData(form, 'input#root_childMarriage_fullName_middle', 'jeffrey');
    fillData(form, 'input#root_childMarriage_fullName_last', 'doe');
    fillData(form, 'input#root_childMarriage_ssn', '123211234');
    changeDropdown(form, 'select#root_childMarriage_birthDateMonth', 1);
    changeDropdown(form, 'select#root_childMarriage_birthDateDay', 1);
    fillData(form, 'input#root_childMarriage_birthDateYear', '2010');
    const month = form.find('select#root_childMarriage_dateMarriedMonth');
    const day = form.find('select#root_childMarriage_dateMarriedDay');
    month.simulate('change', {
      target: { value: '1' },
    });
    day.simulate('change', {
      target: { value: '1' },
    });
    fillData(form, 'input#root_childMarriage_dateMarriedYear', '2010');
    form.find('form').simulate('submit');
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
