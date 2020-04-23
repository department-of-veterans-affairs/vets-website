import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';

describe('Separation Pay', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.veteranDetails.pages.separationPay;
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
    expect(form.find('input').length).to.equal(2);
    form.unmount();
  });

  it('should submit if no answers provided', () => {
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
    expect(onSubmit.calledOnce).to.be.true;
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
          hasSeparationPay: false,
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

  it('should submit if answer is Yes but no other info provided', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={definitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          hasSeparationPay: true,
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should expand more questions when answer is Yes', () => {
    const form = mount(
      <DefinitionTester
        definitions={definitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          hasSeparationPay: true,
        }}
        formData={{}}
      />,
    );

    expect(form.find('.form-radio-buttons').length).to.equal(1);
    expect(form.find('input').length).to.equal(3); // 2 radios + year input
    expect(form.find('select').length).to.equal(1); // service branch
    form.unmount();
  });
});
