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

describe('686 current spouse information', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.addSpouse.pages.spouseNameInformation;

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
    expect(form.find('input').length).to.equal(7);
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
    expect(form.find('.usa-input-error').length).to.equal(5);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should submit with valid information for non-veteran spouse', () => {
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
    fillData(form, 'input#root_spouseFullName_first', 'Jane');
    fillData(form, 'input#root_spouseFullName_last', 'Doe');
    fillData(form, 'input#root_spouseSSN', '123-12-1234');
    changeDropdown(form, 'select#root_spouseDOBMonth', 1);
    changeDropdown(form, 'select#root_spouseDOBDay', 1);
    fillData(form, 'input#root_spouseDOBYear', '1991');
    selectRadio(form, 'root_isSpouseVeteran', 'N');
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should submit with valid information for a veteran spouse', () => {
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
    fillData(form, 'input#root_spouseFullName_first', 'Jane');
    fillData(form, 'input#root_spouseFullName_last', 'Doe');
    fillData(form, 'input#root_spouseSSN', '123-12-1234');
    changeDropdown(form, 'select#root_spouseDOBMonth', 1);
    changeDropdown(form, 'select#root_spouseDOBDay', 1);
    fillData(form, 'input#root_spouseDOBYear', '1991');
    selectRadio(form, 'root_isSpouseVeteran', 'Y');
    fillData(form, 'input#root_spouseVAFileNumber', '123455');
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
