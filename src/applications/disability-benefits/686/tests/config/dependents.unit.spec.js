import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import {
  DefinitionTester,
  fillData,
  selectCheckbox,
} from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form';

describe('686 dependent info', () => {
  const {
    schema: wizardSchema,
    uiSchema: wizardUiSchema,
  } = formConfig.chapters.taskWizard.pages.tasks;

  const {
    schema,
    uiSchema,
  } = formConfig.chapters.unMarriedChildren.pages.dependents;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        data={{}}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );
    expect(form.find('input').length).to.equal(4);
    form.unmount();
  });

  it('should not submit empty form', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(3);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  // with the wizard, if the checkbox value for addChild is false, then this component isn't rendered
  // and an applicant has no dependents.
  it('should submit form if applicant has no dependents', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={wizardSchema}
        definitions={formConfig.defaultDefinitions}
        data={{}}
        onSubmit={onSubmit}
        uiSchema={wizardUiSchema}
      />,
    );
    selectCheckbox(form, 'root_view:selectable686Options_view:addChild', false);
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should submit form with all required fills filled', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        data={{}}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
      />,
    );
    fillData(form, 'input#root_dependents_0_fullName_first', 'test');
    fillData(form, 'input#root_dependents_0_fullName_last', 'test');
    fillData(form, 'select#root_dependents_0_childDateOfBirthMonth', '1');
    fillData(form, 'select#root_dependents_0_childDateOfBirthDay', '31');
    fillData(form, 'input#root_dependents_0_childDateOfBirthYear', '1986');
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should add another dependent', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    fillData(form, 'input#root_dependents_0_fullName_first', 'test');
    fillData(form, 'input#root_dependents_0_fullName_last', 'test');
    fillData(form, 'select#root_dependents_0_childDateOfBirthMonth', '1');
    fillData(form, 'select#root_dependents_0_childDateOfBirthDay', '31');
    fillData(form, 'input#root_dependents_0_childDateOfBirthYear', '1986');
    form.find('.va-growable-add-btn').simulate('click');
    expect(form.find('.va-growable-background').length).to.equal(2);
    form.unmount();
  });
});
