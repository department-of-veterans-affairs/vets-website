import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';

describe('Training Pay', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.veteranDetails.pages.trainingPay;
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
    expect(form.find('.usa-input-error-message').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
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
          hasTrainingPay: false,
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
