import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import {
  DefinitionTester,
  fillData,
  selectCheckbox,
  selectRadio,
} from 'platform/testing/unit/schemaform-utils.jsx';
import { changeDropdown } from 'platform/testing/unit/helpers';
import formConfig from '../../config/form';

describe('686 report dependent death', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.deceasedDependents.pages.dependentInformation;

  const formData = {
    'view:selectable686Options': {
      reportDeath: true,
    },
  };

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
        data={formData}
      />,
    );
    expect(form.find('input').length).to.equal(8);
    expect(form.find('select').length).to.equal(2);
    form.unmount();
  });

  it('should not submit an empty form', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
        data={formData}
      />,
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(5);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('select spouse as dependentType', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
        data={formData}
      />,
    );
    selectRadio(form, 'root_deaths_0_dependentType', 'SPOUSE');
    expect(form.find('input').length).to.equal(8);
    form.unmount();
  });

  it('select dependent parent as dependentType', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
        data={formData}
      />,
    );
    selectRadio(form, 'root_deaths_0_dependentType', 'DEPENDENT_PARENT');
    expect(form.find('input').length).to.equal(8);
    form.unmount();
  });

  it('should expand child options if dependentType is child', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
        data={formData}
      />,
    );
    selectRadio(form, 'root_deaths_0_dependentType', 'CHILD');
    expect(form.find('input').length).to.equal(13);
    form.unmount();
  });

  it('should submit a valid form with a dependent spouse', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
        data={formData}
      />,
    );
    // dependent type
    selectRadio(form, 'root_deaths_0_dependentType', 'SPOUSE');
    fillData(form, 'input#root_deaths_0_fullName_first', 'Billy');
    fillData(form, 'input#root_deaths_0_fullName_last', 'Bob');
    fillData(form, 'input#root_deaths_0_ssn', '123211234');
    changeDropdown(form, 'select#root_deaths_0_birthDateMonth', 1);
    changeDropdown(form, 'select#root_deaths_0_birthDateDay', 1);
    fillData(form, 'input#root_deaths_0_birthDateYear', '2010');

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should submit a valid form with a dependent child', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
        data={formData}
      />,
    );
    // dependent type
    selectRadio(form, 'root_deaths_0_dependentType', 'CHILD');
    selectCheckbox(form, 'root_deaths_0_childStatus_childUnder18', true);
    fillData(form, 'input#root_deaths_0_fullName_first', 'Billy');
    fillData(form, 'input#root_deaths_0_fullName_last', 'Bob');
    fillData(form, 'input#root_deaths_0_ssn', '123211234');
    changeDropdown(form, 'select#root_deaths_0_birthDateMonth', 1);
    changeDropdown(form, 'select#root_deaths_0_birthDateDay', 1);
    fillData(form, 'input#root_deaths_0_birthDateYear', '2010');
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should not submit when child is selected without any subtypes', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
        data={formData}
      />,
    );
    // dependent type
    selectRadio(form, 'root_deaths_0_dependentType', 'CHILD');

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(5);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });
});
