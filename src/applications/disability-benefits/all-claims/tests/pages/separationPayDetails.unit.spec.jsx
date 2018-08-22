import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { DefinitionTester } from '../../../../../platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';

describe('Separation or Training Pay', () => {
  const {
    schema,
    uiSchema
  } = formConfig.chapters.veteranDetails.pages.separationPayDetails;
  const { defaultDefinitions: definitions } = formConfig;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        definitions={definitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}/>
    );

    // Expect two questions: a date picker (two selects), and a select for service branch
    expect(form.find('select').length).to.equal(3);
  });

  it('should not submit without required info', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={definitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
        onSubmit={onSubmit}/>
    );

    // Expect two questions: a date picker (two selects), and a select for service branch
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(2);
    expect(onSubmit.called).to.be.false;
  });

  it('should submit with all required info', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={definitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          separationPayDate: '2010-04-05',
          separationPayBranch: 'Army'
        }}
        formData={{}}
        onSubmit={onSubmit}/>
    );

    // Expect two questions: a date picker (two selects), and a select for service branch
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.calledOnce).to.be.true;
  });
});
