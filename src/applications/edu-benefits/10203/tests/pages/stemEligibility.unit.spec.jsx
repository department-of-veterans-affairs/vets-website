import React from 'react';
import { expect } from 'chai';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils.jsx';
import { mount } from 'enzyme';
import formConfig from '../../config/form';
import sinon from 'sinon';

describe('Stem Eligibility Details', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.programDetails.pages.stemEligibility;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
      />,
    );
    expect(form.find('input').length).to.equal(5);
    form.unmount();
  });

  it('should conditionally display isPursuingTeachingCert', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{ isEnrolledStem: false }}
      />,
    );
    expect(form.find('input').length).to.equal(7);
    form.unmount();
  });

  it('should successfully submit', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
        data={{ isEnrolledStem: true, benefitLeft: 'moreThanSixMonths' }}
      />,
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should require isEnrolledStem', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
        data={{ benefitLeft: 'moreThanSixMonths' }}
      />,
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should require benefitLeft', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
        data={{ isEnrolledStem: true }}
      />,
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should require isPursuingTeachingCert', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
        data={{ isEnrolledStem: false, benefitLeft: 'moreThanSixMonths' }}
      />,
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error-message').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });
});
