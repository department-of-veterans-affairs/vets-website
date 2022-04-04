import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';

import {
  DefinitionTester,
  // fillData,
  selectRadio,
} from 'platform/testing/unit/schemaform-utils.jsx';

import formConfig from '../../config/form.js';

describe('Coronavirus Research Volunteer Form Update', () => {
  const { schema, uiSchema } = formConfig.chapters.chapter1.pages.page1;

  const volunteerData = () => ({
    vaccinated: false,
    VACCINATED_PLAN: 'DEFINITELY',
    diagnosed: true,
    DIAGNOSED_DETAILS: {
      'DIAGNOSED_DETAILS::ANTIBODY_BLOOD_TEST': true,
    },
    DIAGNOSED_SYMPTOMS: {
      'DIAGNOSED_SYMPTOMS::VISION': true,
    },
    consentAgreementAccepted: true,
    ELIGIBLE: false,
    FACILITY: true,
    // zipCode: '99988',
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
    expect(form.find('input').length).to.equal(33);
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
    expect(form.find('.usa-input-error').length).to.equal(4);
    expect(form.find('.input-error-date').length).to.equal(0);

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

  it('should show Zip when Facility response is Yes', () => {
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
    selectRadio(form, 'root_FACILITY', 'Y');

    form.find('form').simulate('submit');
    expect(form.find('input#root_zipCode').length).to.equal(1);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should not show Zip when Facility response is No', () => {
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
    selectRadio(form, 'root_FACILITY', 'N');

    form.find('form').simulate('submit');
    expect(form.find('input#root_zipCode').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  // it('should not allow malformed postal (zip) code', () => {
  //   const onSubmit = sinon.spy();
  //   const form = mount(
  //     <DefinitionTester
  //       pagePerItemIndex={0}
  //       schema={schema}
  //       data={volunteerData()}
  //       definitions={formConfig.defaultDefinitions}
  //       onSubmit={onSubmit}
  //       uiSchema={uiSchema}
  //     />,
  //   );
  //   fillData(form, 'input#root_zipCode', '555556');

  //   form.find('form').simulate('submit');
  //   expect(form.find('.usa-input-error').length).to.equal(1);
  //   expect(form.find('.input-error-date').length).to.equal(0);
  //   expect(onSubmit.called).to.be.false;
  //   form.unmount();
  // });
});
