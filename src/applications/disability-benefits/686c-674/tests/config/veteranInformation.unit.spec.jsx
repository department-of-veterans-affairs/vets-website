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

describe('686 veteran information', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.veteranInformation.pages.veteranInformation;

  const formData = {
    'view:selectable686Options': {
      addSpouse: false,
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
    expect(form.find('input').length).to.equal(7);
    expect(form.find('select').length).to.equal(3);
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
    expect(form.find('.usa-input-error').length).to.equal(4);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should progress with the required fields filled', () => {
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
    fillData(form, 'input#root_first', 'Bill');
    fillData(form, 'input#root_last', 'Bob');
    fillData(form, 'input#root_ssn', '555-55-5551');
    changeDropdown(form, 'select#root_birthDateMonth', 1);
    changeDropdown(form, 'select#root_birthDateDay', 1);
    fillData(form, 'input#root_birthDateYear', '2002');

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});

describe('686 veteran Address', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.veteranInformation.pages.veteranAddress;
  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
      />,
    );
    expect(form.find('input').length).to.equal(8);
    expect(form.find('select').length).to.equal(2);
    form.unmount();
  });

  it('should not progress without the required fields', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
      />,
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(4);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should progress with the required fields filled', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
      />,
    );
    changeDropdown(
      form,
      'select#root_veteranAddress_countryName',
      'United States',
    );
    fillData(form, 'input#root_veteranAddress_addressLine1', '123 Front St');
    fillData(form, 'input#root_veteranAddress_city', 'Someplace');
    changeDropdown(form, 'select#root_veteranAddress_stateCode', 'AL');
    fillData(form, 'input#root_veteranAddress_zipCode', '12345');
    fillData(form, 'input#root_phoneNumber', '2225555551');

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
