import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { DefinitionTester, fillData, selectRadio } from '../../util/schemaform-utils.jsx';
import formConfig from '../../../src/js/pre-need/config/form';

describe('Pre-need burial benefits', () => {
  const { schema, uiSchema } = formConfig.chapters.burialBenefits.pages.burialBenefits;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}/>
    );

    expect(form.find('input').length).to.equal(4);
  });


  it('should not submit empty form', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}/>
    );

    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });

  it('should fill in currently buried persons list', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}/>
    );
    selectRadio(form, 'root_application_hasCurrentlyBuried', '1');

    fillData(form, 'input#root_application_currentlyBuriedPersons_0_name_first', 'test');
    fillData(form, 'input#root_application_currentlyBuriedPersons_0_name_last', 'test2');

    form.find('form').simulate('submit');

    expect(onSubmit.called).to.be.true;
  });

  it('should add another currently buried person', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}/>
    );
    selectRadio(form, 'root_application_hasCurrentlyBuried', '1');

    fillData(form, 'input#root_application_currentlyBuriedPersons_0_name_first', 'test');
    fillData(form, 'input#root_application_currentlyBuriedPersons_0_name_last', 'test2');

    form.find('.va-growable-add-btn').simulate('click');

    fillData(form, 'input#root_application_currentlyBuriedPersons_1_name_first', 'test');
    fillData(form, 'input#root_application_currentlyBuriedPersons_1_name_last', 'test2');

    form.find('form').simulate('submit');

    expect(onSubmit.called).to.be.true;
  });
});
