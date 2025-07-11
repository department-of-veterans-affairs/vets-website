import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { waitFor } from '@testing-library/react';
import { mount } from 'enzyme';

import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';

import formConfig from '../../config/form';

describe('High tech industry page', () => {
  let sandbox;
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.highTechWorkExp.pages.highTechIndustry;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('renders the work experience page', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        data={{}}
        uiSchema={uiSchema}
        formData={{}}
      />,
    );

    expect(form.find('input').length).to.equal(2);

    form.unmount();
  });

  it('fails to submit when no answer selected', async () => {
    const onSubmit = sandbox.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );
    form.find('form').simulate('submit');

    await waitFor(() => {
      form.update();
      expect(form.find('.usa-input-error-message').length).to.equal(1);
      expect(onSubmit.called).to.be.false;
    });

    form.unmount();
  });

  it('renders radio and checkbox group when yes selected', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          currentHighTechnologyEmployment: true,
        }}
        formData={{}}
      />,
    );

    expect(form.find('input').length).to.equal(12);
    form.unmount();
  });

  it('renders second question when no selected', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          currentHighTechnologyEmployment: false,
        }}
        formData={{}}
      />,
    );

    expect(form.find('input').length).to.equal(4);
    form.unmount();
  });

  it('fails to submit when no answer selected with the second question', async () => {
    const onSubmit = sandbox.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          currentHighTechnologyEmployment: false,
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );
    form.find('form').simulate('submit');

    await waitFor(() => {
      form.update();
      expect(form.find('.usa-input-error-message').length).to.equal(1);
      expect(onSubmit.called).to.be.false;
    });

    form.unmount();
  });

  it('renders radio and checkbox group when yes selected on second question', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          currentHighTechnologyEmployment: false,
          pastHighTechnologyEmployment: true,
        }}
        formData={{}}
      />,
    );

    expect(form.find('input').length).to.equal(14);
    form.unmount();
  });

  it('successfully submits when required questions answered', () => {
    const onSubmit = sandbox.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          currentHighTechnologyEmployment: false,
          pastHighTechnologyEmployment: false,
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
});
