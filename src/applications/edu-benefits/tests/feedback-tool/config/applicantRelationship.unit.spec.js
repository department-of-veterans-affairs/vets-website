import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import {
  DefinitionTester,
  selectRadio,
} from '../../../../../platform/testing/unit/schemaform-utils';
import formConfig from '../../../feedback-tool/config/form';

describe('feedback tool applicant info', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.applicantInformation.pages.applicantRelationship;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        data={{}}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );

    expect(form.find('input').length).to.equal(3);
  });

  it('should not submit without required information', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
  });

  it('should submit with required information', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    selectRadio(form, 'root_onBehalfOf', 'Anonymous');
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
  });

  it('should render myself', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    selectRadio(form, 'root_onBehalfOf', 'Myself');
    expect(form.find('input').length).to.equal(3);
  });

  it('should render someone else', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    selectRadio(form, 'root_onBehalfOf', 'Someone else');
    expect(form.find('input').length).to.equal(3);
  });

  it('should render anonymous', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );

    selectRadio(form, 'root_onBehalfOf', 'Anonymous');
    expect(form.find('input').length).to.equal(4);
  });
});
