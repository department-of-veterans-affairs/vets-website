/**
 * This suite of tests is temporarily skipped, as it corresponds to a page that won't be used until a later time.
 * Specifically, Student Networth will be part of a future, post-launch release to support pension claims through the 686-674.
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

describe.skip('Report 674 student networth information', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.report674.pages.studentNetworthInformation;

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
    studentDoesHaveNetworth: '',
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
    expect(form.find('input').length).to.equal(2);
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
    expect(form.find('.usa-input-error').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should submit if a student has no networth', () => {
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
    selectRadio(form, 'root_studentDoesHaveNetworth', 'N');
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should not submit if a student has networth without required fields', () => {
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
    selectRadio(form, 'root_studentDoesHaveNetworth', 'Y');
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(4);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should submit if a student has a networth', () => {
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
    selectRadio(form, 'root_studentDoesHaveNetworth', 'Y');
    fillData(form, 'input#root_studentNetworthInformation_savings', '2000');
    fillData(form, 'input#root_studentNetworthInformation_securities', '2000');
    fillData(form, 'input#root_studentNetworthInformation_realEstate', '2000');
    fillData(form, 'input#root_studentNetworthInformation_otherAssets', '2000');
    fillData(
      form,
      'textarea#root_studentNetworthInformation_remarks',
      'I have a networth',
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
