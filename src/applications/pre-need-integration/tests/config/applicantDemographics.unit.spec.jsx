/* eslint-disable no-shadow */
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
import { uiSchema } from '../../config/pages/applicantDemographics';
import {
  applicantDemographicsSubHeader,
  applicantDemographicsGenderTitle,
  applicantDemographicsMaritalStatusTitle,
} from '../../utils/helpers';

describe('Pre-need applicant demographics', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.applicantInformation.pages.applicantDemographics;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );

    expect(form.find('input').length).to.equal(9);
    form.unmount();
  });

  it('should not submit empty form', () => {
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

    expect(form.find('.usa-input-error').length).to.equal(2);
    expect(onSubmit.called).to.be.false;
    form.unmount();
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
    fillData(form, 'input#root_application_veteran_gender_0', 'Female');
    selectRadio(form, 'root_application_veteran_maritalStatus', 'Single');

    form.find('form').simulate('submit');

    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});

describe('Applicant Demographics uiSchema', () => {
  it('should use custom subHeader when provided', () => {
    const customSubheader = 'Custom Subheader';
    const result = uiSchema(customSubheader);
    expect(result.application['ui:title']).to.equal(customSubheader);
  });

  it('should use custom title when genderTitle provided', () => {
    const customGenderTitle = 'Custom Gender Title';
    const result = uiSchema(undefined, customGenderTitle);
    expect(result.application.veteran.gender['ui:title']).to.equal(
      customGenderTitle,
    );
  });

  it('should use custom maritalStatusTitle when provided', () => {
    const customMaritalStatusTitle = 'Custom Marital Status Title';
    const result = uiSchema(undefined, undefined, customMaritalStatusTitle);
    expect(result.application.veteran.maritalStatus['ui:title']).to.equal(
      customMaritalStatusTitle,
    );
  });

  it('should have displayEmptyObjectOnReview option for applicantDemographicsDescription', () => {
    const result = uiSchema();
    expect(
      result.application['view:applicantDemographicsDescription']['ui:options']
        .displayEmptyObjectOnReview,
    ).to.be.true;
  });

  it('should use default subHeader when not provided', () => {
    const result = uiSchema();
    expect(result.application['ui:title']).to.equal(
      applicantDemographicsSubHeader,
    );
  });

  it('should use default genderTitle when not provided', () => {
    const result = uiSchema();
    expect(result.application.veteran.gender['ui:title']).to.equal(
      applicantDemographicsGenderTitle,
    );
  });

  it('should use default maritalStatusTitle when not provided', () => {
    const result = uiSchema();
    expect(result.application.veteran.maritalStatus['ui:title']).to.equal(
      applicantDemographicsMaritalStatusTitle,
    );
  });
});
