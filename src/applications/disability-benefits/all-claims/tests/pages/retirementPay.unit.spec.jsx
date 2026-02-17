import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { DefinitionTester } from 'platform/testing/unit/schemaform-utils';
import { mount } from 'enzyme';
import { waitFor } from '@testing-library/dom';
import formConfig from '../../config/form';
import { testBranches } from '../../utils/serviceBranches';

describe('Retirement Pay', () => {
  const { schema, uiSchema } =
    formConfig.chapters.veteranDetails.pages.retirementPay;

  it('should render two radio options by default', () => {
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{}}
        formData={{}}
      />,
    );

    expect(form.find('VaRadio').length).to.equal(1);
    expect(form.find('va-radio-option').length).to.equal(2);
    form.unmount();
  });

  it("should submit when 'no' option is selected", async () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{ 'view:hasMilitaryRetiredPay': false }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );
    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(form.find('.usa-input-error-message').length).to.equal(0);
      expect(onSubmit.calledOnce).to.be.true;
    });
    form.unmount();
  });

  it("should fail to submit when 'Yes' option selected and no branch provided", async () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{ 'view:hasMilitaryRetiredPay': true }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );
    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(form.find('.usa-input-error-message').length).to.equal(1);
      expect(onSubmit.called).to.be.false;
    });
    form.unmount();
  });

  it('should submit when all info provided', async () => {
    // Calling testBranches ensures that the branches dropdown is populated
    testBranches();
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        definitions={formConfig.defaultDefinitions}
        schema={schema}
        uiSchema={uiSchema}
        data={{
          'view:hasMilitaryRetiredPay': true,
          militaryRetiredPayBranch: 'Army',
        }}
        formData={{}}
        onSubmit={onSubmit}
      />,
    );
    await waitFor(() => {
      form.find('form').simulate('submit');
      expect(form.find('.usa-input-error-message').length).to.equal(0);
      expect(onSubmit.calledOnce).to.be.true;
    });
    form.unmount();
  });
});
