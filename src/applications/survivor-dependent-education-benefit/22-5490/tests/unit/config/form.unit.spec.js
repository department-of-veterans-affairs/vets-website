import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import {
  fillData,
  fillDate,
  selectCheckbox,
  DefinitionTester,
} from 'platform/testing/unit/schemaform-utils';

import formConfig from '../../../config/form';

describe('Complex Form 22-5490 Detailed Interaction Tests', () => {
  it('should fill out the full name and SSN fields', () => {
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.applicantInformationChapter.pages.applicantInformation;
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={{}}
        formData={{}}
      />,
    );
    fillData(form, 'input#root_fullName_first', 'John');
    fillData(form, 'input#root_fullName_last', 'Doe');
    fillData(form, 'input#root_ssn', '123-45-6789');
    expect(form.find('input#root_fullName_first').prop('value')).to.equal(
      'John',
    );
    expect(form.find('input#root_fullName_last').prop('value')).to.equal('Doe');
    expect(form.find('input#root_ssn').prop('value')).to.equal('123-45-6789');
    form.unmount();
  });
  it('should fill out date fields', () => {
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.serviceHistoryChapter.pages.serviceHistory;
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={{}}
        formData={{}}
      />,
    );
    fillDate(form, 'input#root_someDateField', '1950-1-3');
    expect(form.find('input#root_someDateField').prop('value')).to.equal(
      '1950-01-03',
    );
    form.unmount();
  });
  it('should select a checkbox', () => {
    const {
      schema,
      uiSchema,
    } = formConfig.chapters.additionalInformationChapter.pages.contactInformation;
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={{}}
        formData={{}}
      />,
    );
    selectCheckbox(form, 'input#root_someCheckboxField', true);
    expect(form.find('input#root_someCheckboxField').prop('checked')).to.be
      .true;
    form.unmount();
  });
});
