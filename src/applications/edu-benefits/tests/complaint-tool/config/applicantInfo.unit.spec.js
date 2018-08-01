import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import { DefinitionTester, selectRadio, fillData } from '../../../../../platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../../complaint-tool/config/form';

describe('complaint tool applicant info', () => {
  const { schema, uiSchema } = formConfig.chapters.applicantInformation.pages.applicantInformation;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        data={{}}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}/>
    );

    expect(form.find('input').length).to.equal(3);
  });

  it('should not submit without required information', () => {
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

  it('should submit with required information', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}/>
    );

    selectRadio(form, 'root_onBehalfOf', 'Myself');
    const select  = form.find('select#root_serviceAffiliation');
    select.simulate('change', {
      target: { value: 'Veteran' }
    });
    fillData(form, 'input#root_fullName_first', 'test');
    fillData(form, 'input#root_fullName_last', 'test');
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });

  it('should render myself', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}/>
    );

    selectRadio(form, 'root_onBehalfOf', 'Myself');
    expect(form.find('input').length).to.equal(7);
    expect(form.find('select').length).to.equal(5);
  });

  it('should render myself as a veteran', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}/>
    );

    selectRadio(form, 'root_onBehalfOf', 'Myself');
    const select = form.find('select#root_serviceAffiliation');
    select.simulate('change', {
      target: { value: 'Veteran' }
    });

    expect(form.find('input').length).to.equal(9);
    expect(form.find('select').length).to.equal(10);
  });

  it('should render someone else', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}/>
    );

    selectRadio(form, 'root_onBehalfOf', 'Someone else');
    expect(form.find('input').length).to.equal(7);
    expect(form.find('select').length).to.equal(4);
  });

  it('should render anonymous', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}/>
    );

    selectRadio(form, 'root_onBehalfOf', 'Anonymous');
    expect(form.find('input').length).to.equal(4);
  });


});
