import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { DefinitionTester } from '../../../../../platform/testing/unit/schemaform-utils.jsx';
import { mount } from 'enzyme';
import formConfig from '../../config/form';

describe('Add new disabilities', () => {
  const { schema, uiSchema } = formConfig.chapters.disabilities.pages.addDisabilities;

  test('should render', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}/>
    );

    expect(form.find('input').length).to.equal(2);
  });

  test('should render autosuggest', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:newDisabilities': true
        }}
        formData={{}}/>
    );

    expect(form.find('input').length).to.equal(3);
  });

  test('should add another disability', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:newDisabilities': true,
          newDisabilities: [{
            condition: 'Abnormal Heart'
          }]
        }}
        formData={{}}
        onSubmit={onSubmit}/>
    );

    form.find('.va-growable-add-btn').simulate('click');

    expect(form.find('.va-growable-background').first().text()).to.contain('Abnormal Heart');
  });

  test('should submit when data filled in', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:newDisabilities': true,
          newDisabilities: [{
            condition: 'Test'
          }]
        }}
        formData={{}}
        onSubmit={onSubmit}/>
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });
});
