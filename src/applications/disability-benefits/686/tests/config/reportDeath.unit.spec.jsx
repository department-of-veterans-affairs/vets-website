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
  } = formConfig.chapters.reportDependentDeaths.pages.deaths;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );
    expect(form.find('input').length).to.equal(9);
    form.unmount();
  });

  it('select spouse as dependentType', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );
    selectRadio(form, 'root_deaths_0_dependentType', 'SPOUSE');
    expect(form.find('input').length).to.equal(9);
    form.unmount();
  });

  it('select dependent parent as dependentType', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );
    selectRadio(form, 'root_deaths_0_dependentType', 'DEPENDENT_PARENT');
    expect(form.find('input').length).to.equal(9);
    form.unmount();
  });

  it('should expand child options if dependentType is child', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );
    selectRadio(form, 'root_deaths_0_dependentType', 'CHILD');
    expect(form.find('input').length).to.equal(14);
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
      />,
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(6);
    expect(onSubmit.called).to.be.false;
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
      />,
    );
    // dependent type
    selectRadio(form, 'root_deaths_0_dependentType', 'SPOUSE');
    fillData(form, 'input#root_deaths_0_fullName_first', 'john');
    fillData(form, 'input#root_deaths_0_fullName_last', 'doe');
    // dod
    const monthDropdown = form.find(
      'select#root_deaths_0_deceasedDateOfDeathMonth',
    );
    const dayDropdown = form.find(
      'select#root_deaths_0_deceasedDateOfDeathDay',
    );
    monthDropdown.simulate('change', {
      target: { value: '1' },
    });
    dayDropdown.simulate('change', {
      target: { value: '1' },
    });
    fillData(form, 'input#root_deaths_0_deceasedDateOfDeathYear', '2010');
    // location
    fillData(
      form,
      'input#root_deaths_0_deceasedLocationOfDeath_city',
      'somewhere',
    );
    fillData(form, 'input#root_deaths_0_deceasedLocationOfDeath_state', 'VA');
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
      />,
    );
    // dependent type
    selectRadio(form, 'root_deaths_0_dependentType', 'CHILD');
    fillData(form, 'input#root_deaths_0_fullName_first', 'john');
    fillData(form, 'input#root_deaths_0_fullName_last', 'doe');
    // child subtypes
    selectCheckbox(form, 'root_deaths_0_childStatus_childUnder18', true);
    selectCheckbox(form, 'root_deaths_0_childStatus_stepChild', true);
    selectCheckbox(form, 'root_deaths_0_childStatus_disabled', true);
    // dod
    const monthDropdown = form.find(
      'select#root_deaths_0_deceasedDateOfDeathMonth',
    );
    const dayDropdown = form.find(
      'select#root_deaths_0_deceasedDateOfDeathDay',
    );
    monthDropdown.simulate('change', {
      target: { value: '1' },
    });
    dayDropdown.simulate('change', {
      target: { value: '1' },
    });
    fillData(form, 'input#root_deaths_0_deceasedDateOfDeathYear', '2010');
    // location
    fillData(
      form,
      'input#root_deaths_0_deceasedLocationOfDeath_city',
      'somewhere',
    );
    fillData(form, 'input#root_deaths_0_deceasedLocationOfDeath_state', 'VA');
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
      />,
    );
    // dependent type
    selectRadio(form, 'root_deaths_0_dependentType', 'CHILD');
    fillData(form, 'input#root_deaths_0_fullName_first', 'john');
    fillData(form, 'input#root_deaths_0_fullName_last', 'doe');
    // dod
    const monthDropdown = form.find(
      'select#root_deaths_0_deceasedDateOfDeathMonth',
    );
    const dayDropdown = form.find(
      'select#root_deaths_0_deceasedDateOfDeathDay',
    );
    monthDropdown.simulate('change', {
      target: { value: '1' },
    });
    dayDropdown.simulate('change', {
      target: { value: '1' },
    });
    fillData(form, 'input#root_deaths_0_deceasedDateOfDeathYear', '2010');
    // location
    fillData(
      form,
      'input#root_deaths_0_deceasedLocationOfDeath_city',
      'somewhere',
    );
    fillData(form, 'input#root_deaths_0_deceasedLocationOfDeath_state', 'VA');
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });
});
