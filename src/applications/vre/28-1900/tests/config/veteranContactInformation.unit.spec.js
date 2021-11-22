import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import {
  DefinitionTester,
  fillData,
} from 'platform/testing/unit/schemaform-utils.jsx';
import { changeDropdown } from 'platform/testing/unit/helpers';

import formConfig from '../../config/form';

const {
  schema,
  uiSchema,
} = formConfig.chapters.veteranInformation.pages.contactInformation;

describe('Chapter 31 veteran contact information', () => {
  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
      />,
    );
    expect(form.find('input').length).to.equal(11);
    form.unmount();
  });
  it('should require address, email, and main phone', () => {
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
    expect(form.find('.usa-input-error').length).to.equal(7);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });
  it('should require emails to match', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
      />,
    );
    fillData(form, 'select#root_veteranAddress_country', 'USA');
    fillData(form, 'input#root_veteranAddress_street', 'Some road');
    fillData(form, 'input#root_veteranAddress_city', 'Some city');
    changeDropdown(form, 'select#root_veteranAddress_state', 'DC');
    fillData(form, 'input#root_veteranAddress_postalCode', '12345');
    fillData(form, 'input#root_mainPhone', '1233214567');
    fillData(form, 'input#root_email', 'me2@home.com');
    form.find('input[name="root_view:confirmEmail"]').simulate('change', {
      target: {
        value: 'test@test.com',
      },
    });
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });
  it('should submit with valid fields', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        onSubmit={onSubmit}
      />,
    );
    fillData(form, 'select#root_veteranAddress_country', 'USA');
    fillData(form, 'input#root_veteranAddress_street', 'Some road');
    fillData(form, 'input#root_veteranAddress_city', 'Some city');
    changeDropdown(form, 'select#root_veteranAddress_state', 'DC');
    fillData(form, 'input#root_veteranAddress_postalCode', '12345');
    fillData(form, 'input#root_mainPhone', '1233214567');
    fillData(form, 'input#root_email', 'test@test.com');
    form.find('input[name="root_view:confirmEmail"]').simulate('change', {
      target: {
        value: 'test@test.com',
      },
    });
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
