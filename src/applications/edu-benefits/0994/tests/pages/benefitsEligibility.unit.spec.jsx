import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import {
  DefinitionTester,
  selectRadio,
} from 'platform/testing/unit/schemaform-utils';
import { ERR_MSG_CSS_CLASS } from '../../constants';
import formConfig from '../../config/form';

describe('VET TEC benefits eligibility', () => {
  const page =
    formConfig.chapters.applicantInformation.pages.benefitsEligibility;
  const { schema, uiSchema } = page;

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

  it('should be required', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
      />,
    );

    form.find('form').simulate('submit');
    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(1);
    form.unmount();
  });

  it('should submit without error', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={onSubmit}
      />,
    );

    selectRadio(form, 'root_appliedForVaEducationBenefits', 'Y');
    form.find('form').simulate('submit');
    expect(form.find(ERR_MSG_CSS_CLASS).length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
