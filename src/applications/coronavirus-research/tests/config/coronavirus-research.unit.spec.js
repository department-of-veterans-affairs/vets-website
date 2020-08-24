import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import {
  DefinitionTester,
  fillData,
  selectCheckbox,
  fillDate,
} from 'platform/testing/unit/schemaform-utils.jsx';

import formConfig from '../../config/form.js';

describe('Coronavirus Research Volunteer Form', () => {
  const { schema, uiSchema } = formConfig.chapters.chapter1.pages.page1;

  const volunteerData = () => ({
    diagnosed: false,
    closeContactPositive: 'UNSURE',
    hospitalized: true,
    smokeOrVape: false,
    healthHistory: {
      ALLERGY_VACCINE: true,
      LUNG_DISEASE: true,
      NONE_OF_ABOVE: false,
    },
    employmentStatus: { STUDENT: true },
    transportation: { NONE_OF_ABOVE: true },
    residentsInHome: 'ONE_TWO',
    closeContact: 'ZERO',
    veteranFullName: { first: 'testFName', last: 'testLName' },
    email: 'test@test.com',
    'view:confirmEmail': 'test@test.com',
    phone: '5554443322',
    zipCode: '99988',
    veteranDateOfBirth: '1980-09-24',
    height: 68,
    weight: '200',
    gender: { SELF_IDENTIFY: true, NONE_OF_ABOVE: false },
    raceEthnicityOrigin: { NONE_OF_ABOVE: true },
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
    expect(form.find('input').length).to.equal(69);
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
    expect(form.find('.usa-input-error').length).to.equal(19);
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
    fillData(form, '[name="root_view:confirmEmail"]', 'notAnEmail');

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(2);
    expect(form.find('.input-error-date').length).to.equal(0);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });
  it('should confirm identical email and confirm email', () => {
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
    fillData(form, 'input#root_email', 'test@test.com');
    fillData(form, '[name="root_view:confirmEmail"]', 'not_test@test.com');

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
    selectCheckbox(form, 'root_healthHistory_ALLERGY_VACCINE', false);
    selectCheckbox(form, 'root_healthHistory_LUNG_DISEASE', false);

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
    selectCheckbox(form, 'root_employmentStatus_STUDENT', false);

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
    selectCheckbox(form, 'root_transportation_NONE_OF_ABOVE', false);

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
    selectCheckbox(form, 'root_gender_SELF_IDENTIFY', false);

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
    selectCheckbox(form, 'root_raceEthnicityOrigin_NONE_OF_ABOVE', false);

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(1);
    expect(form.find('.input-error-date').length).to.equal(0);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });
  it('should not allow malformed Weight response', () => {
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
    fillData(form, 'input#root_weight', 'NaN');

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(1);
    expect(form.find('.input-error-date').length).to.equal(0);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });
  it('should not allow malformed Height response', () => {
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
    fillData(form, 'input#root_heightFeet', 'NaN');
    fillData(form, 'input#root_heightInches', 'NaN');

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(1);
    expect(form.find('.input-error-date').length).to.equal(0);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });
});
