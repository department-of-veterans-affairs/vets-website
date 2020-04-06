import React from 'react';
import sinon from 'sinon';
import { mount } from 'enzyme';

import {
  DefinitionTester,
  fillData,
} from '../../../../../platform/testing/unit/schemaform-utils';
import formConfig from '../../../feedback-tool/config/form';

describe('feedback tool applicant info', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.applicantInformation.pages.applicantInformation;

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

    expect(form.find('input').length).toBe(4);
    expect(form.find('select').length).toBe(3);
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

    expect(form.find('input').length).toBe(4);
    expect(form.find('select').length).toBe(2);
    form.unmount();
  });

  it('should not submit without required information for myself', () => {
    const onSubmit = sinon.spy();
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

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).toBe(4);
    expect(onSubmit.called).toBe(false);
    form.unmount();
  });

  it('should not submit without required information for someone else', () => {
    const onSubmit = sinon.spy();
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

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).toBe(3);
    expect(onSubmit.called).toBe(false);
    form.unmount();
  });

  it('should submit with required information for myself', () => {
    const onSubmit = sinon.spy();
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
    fillData(form, 'input#root_socialSecurityNumberLastFour', '1234');
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).toBe(0);
    expect(onSubmit.called).toBe(true);
    form.unmount();
  });

  it('should submit with required information for someone else', () => {
    const onSubmit = sinon.spy();
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
    fillData(form, 'input#root_socialSecurityNumberLastFour', '1234');
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).toBe(0);
    expect(onSubmit.called).toBe(true);
    form.unmount();
  });
});
