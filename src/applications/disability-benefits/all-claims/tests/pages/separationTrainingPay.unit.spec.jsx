import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { DefinitionTester } from '../../../../../platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';

describe('Separation or Training Pay', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.veteranDetails.pages.separationTrainingPay;
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

    // Expect two questions with two radio inputs each
    expect(form.find('.form-radio-buttons').length).to.equal(2);
    expect(form.find('input').length).to.equal(4);
  });

  it('should fail to submit if no answers provided', () => {
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
    expect(form.find('.usa-input-error-message').length).to.equal(2);
    expect(onSubmit.called).to.be.false;
  });

  it('should submit if both questions answered with a no', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={definitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:hasTrainingPay': false,
          'view:hasSeparationPay': false,
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.calledOnce).to.be.true;
  });

  it('should not submit if both answers are Yes but no other info provided', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={definitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:hasTrainingPay': true,
          'view:hasSeparationPay': true,
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(2);
    expect(onSubmit.called).to.be.false;
  });

  it('should expand more questions when answers are Yes', () => {
    const form = mount(
      <DefinitionTester
        definitions={definitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:hasTrainingPay': true,
          'view:hasSeparationPay': true,
        }}
        formData={{}}
      />,
    );

    expect(form.find('.form-radio-buttons').length).to.equal(2);
    expect(form.find('input').length).to.equal(6); // 4 radios + year input + checkbox
    expect(form.find('select').length).to.equal(3); // month, day, service branch
  });
});
