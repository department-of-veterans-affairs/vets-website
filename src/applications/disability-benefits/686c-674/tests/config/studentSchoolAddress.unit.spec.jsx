import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { changeDropdown } from '../helpers/index.js';
import {
  DefinitionTester,
  fillData,
} from 'platform/testing/unit/schemaform-utils.jsx';

import formConfig from '../../config/form';

describe('Report 674 school information', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.report674.pages.studentSchoolAddress;

  const formData = {
    'view:selectable686Options': {
      report674: true,
    },
    studentFullName: {
      first: 'John',
      last: 'Doe',
    },
    schoolAddress: {
      countryName: '',
    },
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
    expect(form.find('input').length).to.equal(8);
    expect(form.find('select').length).to.equal(1);
    form.unmount();
  });

  it('should not progress without the required fields', () => {
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
    expect(form.find('.usa-input-error').length).to.equal(5);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should submit with a school name and a valid domestic US address', () => {
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
    fillData(form, 'input#root_schoolInformation_schoolName', 'Phoenix Online');
    fillData(form, 'input#root_schoolInformation_trainingProgram', 'A Degree');
    changeDropdown(
      form,
      'select#root_schoolAddress_countryName',
      'United States',
    );
    fillData(form, 'input#root_schoolAddress_addressLine1', '1600');
    fillData(form, 'input#root_schoolAddress_city', 'Washington');
    changeDropdown(form, 'select#root_schoolAddress_stateCode', 'DC');
    fillData(form, 'input#root_schoolAddress_zipCode', '20500');
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should submit with a valid international address', () => {
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
    fillData(form, 'input#root_schoolInformation_schoolName', 'Phoenix Online');
    fillData(form, 'input#root_schoolInformation_trainingProgram', 'A Degree');
    changeDropdown(form, 'select#root_schoolAddress_countryName', 'Brazil');
    fillData(form, 'input#root_schoolAddress_addressLine1', '1600');
    fillData(form, 'input#root_schoolAddress_city', 'Rio de Janeiro');
    fillData(form, 'input#root_schoolAddress_internationalPostalCode', '12345');
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
