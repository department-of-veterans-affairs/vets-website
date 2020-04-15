import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { changeDropdown } from '../helpers/index.js';
import {
  DefinitionTester,
  fillData,
  selectRadio,
} from 'platform/testing/unit/schemaform-utils.jsx';

import formConfig from '../../config/form';

describe('686 current marriage co-habitation status', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.addSpouse.pages.doesLiveWithSpouse;

  const formData = {
    'view:selectable686Options': {
      addSpouse: true,
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
    expect(form.find('input').length).to.equal(2);
    form.unmount();
  });

  it('should submit when spouse and veteran live together', () => {
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
    selectRadio(form, 'root_spouseDoesLiveWithVeteran', 'Y');
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should require spouse address if they live apart', () => {
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
    selectRadio(form, 'root_spouseDoesLiveWithVeteran', 'N');
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(4);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should submit when spouse lives apart with all necessary information', () => {
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
    selectRadio(form, 'root_spouseDoesLiveWithVeteran', 'N');
    fillData(
      form,
      'input#root_currentSpouseReasonForSeparation',
      'This is an explanation',
    );
    changeDropdown(
      form,
      'select#root_currentSpouseAddress_countryName',
      'United States',
    );
    fillData(
      form,
      'input#root_currentSpouseAddress_addressLine1',
      '123 Back St',
    );
    fillData(form, 'input#root_currentSpouseAddress_city', 'SomeCity');
    changeDropdown(form, 'select#root_currentSpouseAddress_stateCode', 'AL');
    fillData(form, 'input#root_currentSpouseAddress_zipCode', '12345');
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
