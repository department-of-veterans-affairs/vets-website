import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { render, waitFor } from '@testing-library/react';
import { mount } from 'enzyme';
import {
  DefinitionTester,
  selectRadio,
  getFormDOM,
} from 'platform/testing/unit/schemaform-utils';
import { ERR_MSG_CSS_CLASS } from '../../constants';
import formConfig from '../../config/form';

describe('VET TEC benefits eligibility', () => {
  let sandbox;
  const page =
    formConfig.chapters.applicantInformation.pages.benefitsEligibility;
  const { schema, uiSchema } = page;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should render', () => {
    const form = mount(
      <DefinitionTester schema={schema} uiSchema={uiSchema} />,
    );
    expect(form.find('input').length).to.equal(2);
    expect(form.find('.form-expanding-group-open').length).to.equal(0);
    form.unmount();
  });

  it('should display 22-1990 instructions', () => {
    const form = mount(
      <DefinitionTester schema={schema} uiSchema={uiSchema} />,
    );

    selectRadio(form, 'root_appliedForVaEducationBenefits', 'N');
    expect(form.find('va-summary-box').length).to.equal(1);
    form.unmount();
  });

  it('should be required', async () => {
    const onSubmit = sandbox.spy();
    const { container } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
      />,
    );

    const formDOM = getFormDOM({ container });
    formDOM.submitForm();

    await waitFor(() => {
      expect(container.querySelectorAll(ERR_MSG_CSS_CLASS).length).to.equal(1);
    });
  });

  it('should submit without error', async () => {
    const onSubmit = sandbox.spy();
    const { container } = render(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
      />,
    );

    const formDOM = getFormDOM({ container });
    formDOM.selectRadio('root_appliedForVaEducationBenefits', 'Y');
    formDOM.submitForm();

    await waitFor(() => {
      expect(container.querySelectorAll(ERR_MSG_CSS_CLASS).length).to.equal(0);
      expect(onSubmit.called).to.be.true;
    });
  });
});
