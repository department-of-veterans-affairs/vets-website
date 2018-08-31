import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { DefinitionTester, selectRadio } from '../../../../../platform/testing/unit/schemaform-utils.jsx';
import { mount } from 'enzyme';
import formConfig from '../../config/form';

describe('New disabilities follow up info', () => {
  const { schema, uiSchema, arrayPath } = formConfig.chapters.disabilities.pages.newDisabilityFollowUp;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          ratedDisabilities: [{
            name: 'Test',
            diagnosticCode: 10
          }],
          newDisabilities: [{
            diagnosticCode: 10
          }]
        }}
        formData={{}}/>
    );

    expect(form.find('input').length).to.equal(4);
    expect(form.find('select').length).to.equal(2);
  });

  it('should render primary disabilities', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          ratedDisabilities: [{
            name: 'Test',
            diagnosticCode: 10
          }],
          newDisabilities: [{
            diagnosticCode: 10
          }]
        }}
        formData={{}}/>
    );

    selectRadio(form, 'root_cause', 'SECONDARY');

    expect(form.find('input').length).to.equal(4);
    expect(form.find('select').length).to.equal(3);
    expect(form.find('select').first().find('option').length).to.equal(2);
  });

  it('should render mistreatment question', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          ratedDisabilities: [{
            name: 'Test',
            diagnosticCode: 10
          }],
          newDisabilities: [{
            diagnosticCode: 10
          }]
        }}
        formData={{}}/>
    );

    selectRadio(form, 'root_cause', 'VA');

    expect(form.find('input').length).to.equal(5);
  });

  it('should submit when data filled in', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        arrayPath={arrayPath}
        pagePerItemIndex={0}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          newDisabilities: [{
            diagnosticCode: 10
          }]
        }}
        formData={{}}
        onSubmit={onSubmit}/>
    );

    selectRadio(form, 'root_cause', 'NEW');

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
