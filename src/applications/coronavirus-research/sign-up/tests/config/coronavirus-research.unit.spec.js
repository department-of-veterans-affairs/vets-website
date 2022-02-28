import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import {
  DefinitionTester,
  fillData,
  selectCheckbox,
  fillDate,
  selectRadio,
} from 'platform/testing/unit/schemaform-utils.jsx';

import formConfig from '../../config/form.js';

describe('Coronavirus Research Volunteer Form', () => {
  const { schema, uiSchema } = formConfig.chapters.chapter1.pages.page1;

  const volunteerData = () => ({
    diagnosed: true,
    DIAGNOSED_DETAILS: {
      'DIAGNOSED_DETAILS::ANTIBODY_BLOOD_TEST': true,
    },
    DIAGNOSED_SYMPTOMS: {
      'DIAGNOSED_SYMPTOMS::VISION': true,
    },
    vaccinated: false,
    VACCINATED_PLAN: 'DEFINITELY',
    closeContactPositive: 'UNSURE',
    hospitalized: true,
    smokeOrVape: false,
    HEALTH_HISTORY: {
      'HEALTH_HISTORY::ALLERGY_VACCINE': true,
      'HEALTH_HISTORY::LUNG_DISEASE': true,
      'HEALTH_HISTORY::NONE_OF_ABOVE': false,
    },
    EMPLOYMENT_STATUS: { 'EMPLOYMENT_STATUS::STUDENT': true },
    TRANSPORTATION: {
      'TRANSPORTATION::NONE_OF_ABOVE': false,
      'TRANSPORTATION::CARPOOL_OR_VANPOOL': true,
    },
    residentsInHome: 'ONE_TWO',
    closeContact: 'ZERO',
    veteranFullName: { first: 'testFName', last: 'testLName' },
    email: 'test@test.com',
    phone: '5554443322',
    zipCode: '99988',
    veteranDateOfBirth: '1980-09-24',
    VETERAN: { 'VETERAN::VETERAN': true, 'VETERAN::VA_EMPLOYEE': true },
    GENDER: { 'GENDER::NON_BINARY': true, 'GENDER::NONE_OF_ABOVE': false },
    GENDER_SELF_IDENTIFY_DETAILS: 'This is a gender self description',
    RACE_ETHNICITY: { 'RACE_ETHNICITY::NONE_OF_ABOVE': true },
    consentAgreementAccepted: true,
    ELIGIBLE: false,
    FACILITY: false,
  });
  it('should render', () => {
    const form = mount(
      <DefinitionTester
        pagePerItemIndex={0}
        schema={schema}
        data={volunteerData()}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );
    expect(form.find('input').length).to.equal(103);
    form.unmount();
  });

  it('should not submit empty form', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        pagePerItemIndex={0}
        schema={schema}
        data={{}}
        definitions={formConfig.defaultDefinitions}
        uiSchema={uiSchema}
      />,
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(21);
    expect(form.find('.input-error-date').length).to.equal(1);

    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should submit completed form', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        pagePerItemIndex={0}
        schema={schema}
        data={volunteerData()}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(form.find('.input-error-date').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
  it('should not allow malformed email response', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        pagePerItemIndex={0}
        schema={schema}
        data={volunteerData()}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    fillData(form, 'input#root_email', 'notAnEmail');
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(1);
    expect(form.find('.input-error-date').length).to.equal(0);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });
  it('should not allow future date of birth', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        pagePerItemIndex={0}
        schema={schema}
        data={volunteerData()}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    fillDate(form, 'root_veteranDateOfBirth', '2200-09-24');

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(1);
    expect(form.find('.input-error-date').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });
  it('should not allow malformed date', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        pagePerItemIndex={0}
        schema={schema}
        data={volunteerData()}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    fillDate(form, 'root_veteranDateOfBirth', '19738393-09-24');

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(1);
    expect(form.find('.input-error-date').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });
  it('should not allow malformed phone number', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        pagePerItemIndex={0}
        schema={schema}
        data={volunteerData()}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    fillData(form, 'input#root_phone', '77788899991010');

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(1);
    expect(form.find('.input-error-date').length).to.equal(0);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });
  it('should not allow malformed postal (zip) code', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        pagePerItemIndex={0}
        schema={schema}
        data={volunteerData()}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    fillData(form, 'input#root_zipCode', '555556');

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(1);
    expect(form.find('.input-error-date').length).to.equal(0);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });
  it('should not allow empty Health History response', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        pagePerItemIndex={0}
        schema={schema}
        data={volunteerData()}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    selectCheckbox(
      form,
      'root_HEALTH_HISTORY_HEALTH_HISTORY::ALLERGY_VACCINE',
      false,
    );
    selectCheckbox(
      form,
      'root_HEALTH_HISTORY_HEALTH_HISTORY::LUNG_DISEASE',
      false,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(1);
    expect(form.find('.input-error-date').length).to.equal(0);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });
  it('should not allow empty Employment Status response', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        pagePerItemIndex={0}
        schema={schema}
        data={volunteerData()}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    selectCheckbox(
      form,
      'root_EMPLOYMENT_STATUS_EMPLOYMENT_STATUS::STUDENT',
      false,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(1);
    expect(form.find('.input-error-date').length).to.equal(0);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });
  it('should not allow empty Transportation response', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        pagePerItemIndex={0}
        schema={schema}
        data={volunteerData()}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    selectCheckbox(
      form,
      'root_TRANSPORTATION_TRANSPORTATION::CARPOOL_OR_VANPOOL',
      false,
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(1);
    expect(form.find('.input-error-date').length).to.equal(0);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });
  it('should not allow empty Veteran response', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        pagePerItemIndex={0}
        schema={schema}
        data={volunteerData()}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    selectCheckbox(form, 'root_VETERAN_VETERAN::VETERAN', false);
    selectCheckbox(form, 'root_VETERAN_VETERAN::VA_EMPLOYEE', false);

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(1);
    expect(form.find('.input-error-date').length).to.equal(0);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });
  it('should not allow empty Gender response', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        pagePerItemIndex={0}
        schema={schema}
        data={volunteerData()}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    selectCheckbox(form, 'root_GENDER_GENDER::NON_BINARY', false);

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(1);
    expect(form.find('.input-error-date').length).to.equal(0);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });
  it('should not allow empty Race, Ethinicty, Origin response', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        pagePerItemIndex={0}
        schema={schema}
        data={volunteerData()}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    selectCheckbox(
      form,
      'root_RACE_ETHNICITY_RACE_ETHNICITY::NONE_OF_ABOVE',
      false,
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(1);
    expect(form.find('.input-error-date').length).to.equal(0);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });
  it('should show Gender Detail Text box when Gender response is SELF_IDENTIFY', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        pagePerItemIndex={0}
        schema={schema}
        data={volunteerData()}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    selectCheckbox(form, 'root_GENDER_GENDER::SELF_IDENTIFY', true);

    form.find('form').simulate('submit');
    expect(
      form.find('input#root_GENDER_SELF_IDENTIFY_DETAILS').length,
    ).to.equal(1);
    expect(form.find('.input-error-date').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
  it('should not show Gender Detail Text box when SELF_IDENTIFY is not selected', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        pagePerItemIndex={0}
        schema={schema}
        data={volunteerData()}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    selectCheckbox(form, 'root_GENDER_GENDER::SELF_IDENTIFY', false);

    form.find('form').simulate('submit');
    expect(
      form.find('input#root_GENDER_SELF_IDENTIFY_DETAILS').length,
    ).to.equal(0);
    expect(form.find('.input-error-date').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
  it('should show Diagnosed Detail Checkboxes when Diagnosed response is Yes', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        pagePerItemIndex={0}
        schema={schema}
        data={volunteerData()}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    selectRadio(form, 'root_diagnosed', 'Y');

    form.find('form').simulate('submit');
    expect(
      form.find(
        'input[id="root_DIAGNOSED_DETAILS_DIAGNOSED_DETAILS::ANTIBODY_BLOOD_TEST"]',
      ).length,
    ).to.equal(1);
    expect(
      form.find(
        'input[id="root_DIAGNOSED_DETAILS_DIAGNOSED_DETAILS::NASAL_SWAB_TEST_POSITIVE"]',
      ).length,
    ).to.equal(1);
    expect(
      form.find(
        'input[id="root_DIAGNOSED_DETAILS_DIAGNOSED_DETAILS::SYMPTOMS_ONLY"]',
      ).length,
    ).to.equal(1);
    expect(
      form.find(
        'input[id="root_DIAGNOSED_DETAILS_DIAGNOSED_DETAILS::DIFFERENT_METHOD"]',
      ).length,
    ).to.equal(1);
    // expect(form.find('.input-error-date').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should Not show Diagnosed Detail Checkboxes when Diagnosed response is No', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        pagePerItemIndex={0}
        schema={schema}
        data={volunteerData()}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    selectRadio(form, 'root_diagnosed', 'N');

    form.find('form').simulate('submit');
    expect(
      form.find(
        'input[id="root_DIAGNOSED_DETAILS_DIAGNOSED_DETAILS::ANTIBODY_BLOOD_TEST"]',
      ).length,
    ).to.equal(0);
    expect(
      form.find(
        'input[id="root_DIAGNOSED_DETAILS_DIAGNOSED_DETAILS::NASAL_SWAB_TEST_POSITIVE"]',
      ).length,
    ).to.equal(0);
    expect(
      form.find(
        'input[id="root_DIAGNOSED_DETAILS_DIAGNOSED_DETAILS::SYMPTOMS_ONLY"]',
      ).length,
    ).to.equal(0);
    expect(
      form.find(
        'input[id="root_DIAGNOSED_DETAILS_DIAGNOSED_DETAILS::DIFFERENT_METHOD"]',
      ).length,
    ).to.equal(0);
    // expect(form.find('.input-error-date').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
  it('should show Vaccinated Plan Radios when Vaccinated response is No', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        pagePerItemIndex={0}
        schema={schema}
        data={volunteerData()}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
        uiSchema={uiSchema}
      />,
    );
    selectRadio(form, 'root_vaccinated', 'N');

    form.find('form').simulate('submit');
    expect(form.find('input[id="root_VACCINATED_PLAN_0"]').length).to.equal(1);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
