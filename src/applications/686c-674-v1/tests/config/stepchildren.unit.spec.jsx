import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import {
  DefinitionTester,
  fillData,
} from 'platform/testing/unit/schemaform-utils.jsx';
import { changeDropdown } from 'platform/testing/unit/helpers';
import formConfig from '../../config/form.js';

describe('686 stepchildren', () => {
  const formData = {
    'view:selectable686Options': {
      reportStepchildNotInHousehold: true,
    },
  };

  const {
    schema,
    uiSchema,
  } = formConfig.chapters.reportStepchildNotInHousehold.pages.stepchildren;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
        definitions={formConfig.defaultDefinitions}
      />,
    );
    expect(form.find('input').length).to.equal(5);
    expect(form.find('select').length).to.equal(2);
    form.unmount();
  });

  it('should not allow you to proceed without required fields filled', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
      />,
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(4);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should should submit with required fields filled out', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
      />,
    );
    fillData(form, 'input#root_stepChildren_0_fullName_first', 'Bill');
    fillData(form, 'input#root_stepChildren_0_fullName_last', 'Bob');
    fillData(form, 'input#root_stepChildren_0_ssn', '123211234');
    changeDropdown(form, 'select#root_stepChildren_0_birthDateMonth', 1);
    changeDropdown(form, 'select#root_stepChildren_0_birthDateDay', 1);
    fillData(form, 'input#root_stepChildren_0_birthDateYear', '2010');
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
