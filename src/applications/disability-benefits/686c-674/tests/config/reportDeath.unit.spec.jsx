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
    expect(form.find('input').length).to.equal(6);
    expect(form.find('select').length).to.equal(1);
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
    expect(form.find('.usa-input-error').length).to.equal(3);
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
    expect(form.find('input').length).to.equal(6);
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
    expect(form.find('input').length).to.equal(6);
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
    expect(form.find('input').length).to.equal(11);
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
    expect(form.find('.usa-input-error').length).to.equal(3);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });
});
