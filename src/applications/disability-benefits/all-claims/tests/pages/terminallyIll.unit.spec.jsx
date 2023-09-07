import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import formConfig from '../../config/form';

describe('Terminally Ill', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.veteranDetails.pages.terminallyIll;
  const { defaultDefinitions: definitions } = formConfig;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        definitions={definitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    // Expect one question with two radio inputs
    expect(form.find('.form-radio-buttons').length).to.equal(1);
    expect(form.find('.form-radio-buttons input').length).to.equal(2);
    expect(form.find('input').length).to.equal(2);
    form.unmount();
  });

  it('should be allowed to submit if no answers are provided', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={definitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should submit if question answered with a no', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={definitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          isTerminallyIll: false,
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.calledOnce).to.be.true;
    form.unmount();
  });
});
