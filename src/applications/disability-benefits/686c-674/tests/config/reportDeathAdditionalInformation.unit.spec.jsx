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
import { changeDropdown } from '../helpers/index';
import formConfig from '../../config/form';

describe('686 report dependent death', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
  } = formConfig.chapters.deceasedDependents.pages.dependentAdditionalInformation;

  const formData = {
    'view:selectable686Options': {
      reportDeath: true,
    },
    deaths: [
      {
        fullName: {
          first: 'Adam',
          last: 'Hubers'
        }
      }
    ],
  }

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
        data={formData}
        pagePerItemIndex={0}
        arrayPath={arrayPath}
      />,
    );
    expect(form.find('input').length).to.equal(6);
    form.unmount();
  });

  it('select spouse as dependentType', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
        data={formData}
        pagePerItemIndex={0}
        arrayPath={arrayPath}
      />,
    );
    selectRadio(form, 'root_dependentType', 'SPOUSE');
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
        pagePerItemIndex={0}
        arrayPath={arrayPath}
      />,
    );
    selectRadio(form, 'root_dependentType', 'DEPENDENT_PARENT');
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
        pagePerItemIndex={0}
        arrayPath={arrayPath}
      />,
    );
    selectRadio(form, 'root_dependentType', 'CHILD');
    expect(form.find('input').length).to.equal(11);
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
        pagePerItemIndex={0}
        arrayPath={arrayPath}
      />,
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(2);
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
        data={formData}
        pagePerItemIndex={0}
        arrayPath={arrayPath}
      />,
    );
    // dependent type
    selectRadio(form, 'root_dependentType', 'SPOUSE');
    // dod
    changeDropdown(form, 'select#root_deceasedDateOfDeathMonth', 1);
    changeDropdown(form, 'select#root_deceasedDateOfDeathDay', 1);
    fillData(form, 'input#root_deceasedDateOfDeathYear', '2010');
    // location
    fillData(
      form,
      'input#root_deceasedLocationOfDeath_state',
      'somewhere',
    );
    fillData(form, 'input#root_deceasedLocationOfDeath_city', 'VA');
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
        pagePerItemIndex={0}
        arrayPath={arrayPath}
      />,
    );
    // dependent type
    selectRadio(form, 'root_dependentType', 'CHILD');
    // child subtypes
    selectCheckbox(form, 'root_childStatus_childUnder18', true);

    // dod
    changeDropdown(form, 'select#root_deceasedDateOfDeathMonth', 1);
    changeDropdown(form, 'select#root_deceasedDateOfDeathDay', 1);
    fillData(form, 'input#root_deceasedDateOfDeathYear', '2010');
    // location
    fillData(
      form,
      'input#root_deceasedLocationOfDeath_state',
      'somewhere',
    );
    fillData(form, 'input#root_deceasedLocationOfDeath_city', 'VA');
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
        pagePerItemIndex={0}
        arrayPath={arrayPath}
      />,
    );
    // dependent type
    selectRadio(form, 'root_dependentType', 'CHILD');

    // dod
    changeDropdown(form, 'select#root_deceasedDateOfDeathMonth', 1);
    changeDropdown(form, 'select#root_deceasedDateOfDeathDay', 1);
    fillData(form, 'input#root_deceasedDateOfDeathYear', '2010');
    // location
    fillData(
      form,
      'input#root_deceasedLocationOfDeath_state',
      'somewhere',
    );
    fillData(form, 'input#root_deceasedLocationOfDeath_city', 'VA');
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });
});
