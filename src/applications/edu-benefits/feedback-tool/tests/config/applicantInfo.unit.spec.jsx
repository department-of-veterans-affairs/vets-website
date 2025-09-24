import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { render, waitFor } from '@testing-library/react';

import {
  DefinitionTester,
  fillData,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';

describe('feedback tool applicant info', () => {
  let sandbox;
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.applicantInformation.pages.applicantInformation;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should render myself', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        data={{
          onBehalfOf: 'Myself',
        }}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );

    expect(form.find('input').length).to.equal(3);
    expect(form.find('select').length).to.equal(3);
    form.unmount();
  });

  it('should render someone else', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        data={{
          onBehalfOf: 'Someone else',
        }}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );

    expect(form.find('input').length).to.equal(3);
    expect(form.find('select').length).to.equal(2);
    form.unmount();
  });

  it('should not submit without required information for myself', async () => {
    const onSubmit = sandbox.spy();
    const { container } = render(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        data={{
          onBehalfOf: 'Myself',
        }}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    const formDOM = getFormDOM({ container });
    formDOM.submitForm();

    await waitFor(() => {
      expect(container.querySelectorAll('.usa-input-error').length).to.equal(3);
      expect(onSubmit.called).to.be.false;
    });
  });

  it('should not submit without required information for someone else', async () => {
    const onSubmit = sandbox.spy();
    const { container } = render(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        data={{
          onBehalfOf: 'Someone else',
        }}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    const formDOM = getFormDOM({ container });
    formDOM.submitForm();

    await waitFor(() => {
      expect(container.querySelectorAll('.usa-input-error').length).to.equal(2);
      expect(onSubmit.called).to.be.false;
    });
  });

  it('should submit with required information for myself', () => {
    const onSubmit = sandbox.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        data={{
          onBehalfOf: 'Myself',
        }}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    const select = form.find('select#root_serviceAffiliation');
    select.simulate('change', {
      target: { value: 'Servicemember' },
    });
    fillData(form, 'input#root_fullName_first', 'test');
    fillData(form, 'input#root_fullName_last', 'test');
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should submit with required information for someone else', () => {
    const onSubmit = sandbox.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        data={{
          onBehalfOf: 'Someone else',
        }}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    fillData(form, 'input#root_fullName_first', 'test');
    fillData(form, 'input#root_fullName_last', 'test');
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
