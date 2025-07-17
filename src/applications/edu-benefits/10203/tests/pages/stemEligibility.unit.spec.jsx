import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { waitFor } from '@testing-library/react';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { mount } from 'enzyme';
import formConfig from '../../config/form';

describe('Stem Eligibility Details', () => {
  let sandbox;
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.programDetails.pages.stemEligibility;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

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
    const onSubmit = sandbox.spy();
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

  it('should require isEnrolledStem', async () => {
    const onSubmit = sandbox.spy();
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

    await waitFor(() => {
      form.update();
      expect(form.find('.usa-input-error-message').length).to.equal(1);
      expect(onSubmit.called).to.be.false;
    });

    form.unmount();
  });

  it('should require benefitLeft', async () => {
    const onSubmit = sandbox.spy();
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

    await waitFor(() => {
      form.update();
      expect(form.find('.usa-input-error-message').length).to.equal(1);
      expect(onSubmit.called).to.be.false;
    });

    form.unmount();
  });

  it('should require isPursuingTeachingCert', async () => {
    const onSubmit = sandbox.spy();
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

    await waitFor(() => {
      form.update();
      expect(form.find('.usa-input-error-message').length).to.equal(1);
      expect(onSubmit.called).to.be.false;
    });

    form.unmount();
  });
});
