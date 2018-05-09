import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { DefinitionTester, fillData, fillDate } from '../../../../../platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form';

describe('686 spouse marriage history', () => {
  const { schema, uiSchema, depends } = formConfig.chapters.currentSpouseInfo.pages.spouseMarriageHistory;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        data={{
          marriages: [{
            spouseFullName: {
              first: 'Jane',
              last: 'Doe'
            }
          }]
        }}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}/>
    );

    expect(form.find('input').length).to.equal(9);
    expect(form.find('select').length).to.equal(5);
    expect(form.find('#root_spouseMarriages_0_dateOfMarriage-label').text()).to.contain('Jane Doe');
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

    expect(form.find('.usa-input-error').length).to.equal(7);
    expect(onSubmit.called).to.be.false;
  });

  it('should submit with valid data and add another', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}/>
    );

    fillData(form, 'input#root_spouseMarriages_0_spouseFullName_first', 'test');
    fillData(form, 'input#root_spouseMarriages_0_spouseFullName_last', 'test');
    fillDate(form, 'root_spouseMarriages_0_dateOfMarriage', '2001-10-21');
    fillData(form, 'input#root_spouseMarriages_0_locationOfMarriage', 'The Pacific');
    fillData(form, 'input#root_spouseMarriages_0_reasonForSeparation_1', 'Divorced');
    fillData(form, 'input#root_spouseMarriages_0_locationOfSeparation', 'A town');
    fillDate(form, 'root_spouseMarriages_0_dateOfSeparation', '2002-11-21');

    form.find('form').simulate('submit');

    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;

    form.find('.va-growable-add-btn').simulate('click');

    expect(form.find('.va-growable-background').first().text()).to.contain('test test');
  });

  it('depends should return true if married and spouse was married before', () => {
    const result = depends({ maritalStatus: 'Married', 'view:spouseMarriedBefore': true });

    expect(result).to.be.true;
  });
});
