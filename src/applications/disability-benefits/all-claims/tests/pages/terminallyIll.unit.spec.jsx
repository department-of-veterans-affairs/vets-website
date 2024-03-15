import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { render } from '@testing-library/react';
import { DefinitionTester } from '@department-of-veterans-affairs/platform-testing/schemaform-utils';
import formConfig from '../../config/form';

describe('Terminally Ill', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.veteranDetails.pages.terminallyIll;
  const { defaultDefinitions: definitions } = formConfig;

  it('should render', () => {
    const { container, getByText } = render(
      <DefinitionTester
        definitions={definitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    getByText('High Priority claims');

    const question = container.querySelector('va-radio');
    expect(question).to.have.attribute('label', 'Are you terminally ill?');

    expect(container.querySelector('va-radio-option[label="Yes"', container)).to
      .exist;
    expect(container.querySelector('va-radio-option[label="No"', container)).to
      .exist;
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
