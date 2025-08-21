/**
 * This suite of tests is temporarily skipped, as it corresponds to a page that won't be used until a later time.
 * Specifically, Student Income will be part of a future, post-launch release to support pension claims through the 686-674.
 */
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import {
  DefinitionTester,
  fillData,
  selectRadio,
} from 'platform/testing/unit/schemaform-utils.jsx';

import formConfig from '../../config/form';

describe.skip('Report 674 student income information', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.report674.pages.studentIncomeInformation;

  const formData = {
    'view:selectable686Options': {
      report674: true,
    },
    studentNameAndSSN: {
      fullName: {
        first: 'John',
        last: 'Doe',
      },
    },
    studentAddressMarriageTuition: {
      address: {
        countryName: '',
      },
    },
    programInformation: {
      studentIsEnrolledFullTime: '',
    },
    studentDoesEarnIncome: '',
    studentWillEarnIncome: '',
  };

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={formData}
      />,
    );
    expect(form.find('input').length).to.equal(4);
    form.unmount();
  });

  it('should not submit without required fields', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={formData}
        onSubmit={onSubmit}
      />,
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(2);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should submit if a student did not and will not make any income', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={formData}
        onSubmit={onSubmit}
      />,
    );
    selectRadio(form, 'root_studentDoesEarnIncome', 'N');
    selectRadio(form, 'root_studentWillEarnIncomeNextYear', 'N');
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should submit if a student earned income this year but will not next year', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={formData}
        onSubmit={onSubmit}
      />,
    );
    selectRadio(form, 'root_studentDoesEarnIncome', 'Y');
    fillData(
      form,
      'input#root_studentEarningsFromSchoolYear_earningsFromAllEmployment',
      '2000',
    );
    fillData(
      form,
      'input#root_studentEarningsFromSchoolYear_annualSocialSecurityPayments',
      '2000',
    );
    fillData(
      form,
      'input#root_studentEarningsFromSchoolYear_otherAnnuitiesIncome',
      '2000',
    );
    fillData(
      form,
      'input#root_studentEarningsFromSchoolYear_allOtherIncome',
      '2000',
    );
    selectRadio(form, 'root_studentWillEarnIncomeNextYear', 'N');
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should submit if a student did not earn income this year but will next year', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={formData}
        onSubmit={onSubmit}
      />,
    );
    selectRadio(form, 'root_studentDoesEarnIncome', 'N');
    selectRadio(form, 'root_studentWillEarnIncomeNextYear', 'Y');
    fillData(
      form,
      'input#root_studentExpectedEarningsNextYear_earningsFromAllEmployment',
      '2000',
    );
    fillData(
      form,
      'input#root_studentExpectedEarningsNextYear_annualSocialSecurityPayments',
      '2000',
    );
    fillData(
      form,
      'input#root_studentExpectedEarningsNextYear_otherAnnuitiesIncome',
      '2000',
    );
    fillData(
      form,
      'input#root_studentExpectedEarningsNextYear_allOtherIncome',
      '2000',
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should submit if a student earned income this year and will earn income next year', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={formData}
        onSubmit={onSubmit}
      />,
    );
    selectRadio(form, 'root_studentDoesEarnIncome', 'Y');
    fillData(
      form,
      'input#root_studentEarningsFromSchoolYear_earningsFromAllEmployment',
      '2000',
    );
    fillData(
      form,
      'input#root_studentEarningsFromSchoolYear_annualSocialSecurityPayments',
      '2000',
    );
    fillData(
      form,
      'input#root_studentEarningsFromSchoolYear_otherAnnuitiesIncome',
      '2000',
    );
    fillData(
      form,
      'input#root_studentEarningsFromSchoolYear_allOtherIncome',
      '2000',
    );
    selectRadio(form, 'root_studentWillEarnIncomeNextYear', 'Y');
    fillData(
      form,
      'input#root_studentExpectedEarningsNextYear_earningsFromAllEmployment',
      '2000',
    );
    fillData(
      form,
      'input#root_studentExpectedEarningsNextYear_annualSocialSecurityPayments',
      '2000',
    );
    fillData(
      form,
      'input#root_studentExpectedEarningsNextYear_otherAnnuitiesIncome',
      '2000',
    );
    fillData(
      form,
      'input#root_studentExpectedEarningsNextYear_allOtherIncome',
      '2000',
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
