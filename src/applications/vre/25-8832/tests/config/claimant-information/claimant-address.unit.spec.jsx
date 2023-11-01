import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import {
  DefinitionTester,
  fillData,
} from 'platform/testing/unit/schemaform-utils.jsx';
import { changeDropdown } from 'platform/testing/unit/helpers';
import formConfig from '../../../config/form';

describe('Chapter 36 Claimant Address', () => {
  const {
    schema,
    uiSchema,
  } = formConfig.chapters.claimantInformation.pages.claimantAddress;

  const formData = {
    status: 'isSpouse',
    claimantAddress: {
      country: 'USA',
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
    expect(form.find('input').length).to.equal(9);
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
    expect(form.find('.usa-input-error').length).to.equal(7);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should require a confirmation of the email address', () => {
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

    changeDropdown(form, 'select#root_claimantAddress_country', 'USA');
    fillData(form, 'input#root_claimantAddress_street', 'Sunny Road');
    fillData(form, 'input#root_claimantAddress_city', 'Someplace');
    changeDropdown(form, 'select#root_claimantAddress_state', 'DC');
    fillData(form, 'input#root_claimantAddress_postalCode', '12345');
    fillData(form, 'input#root_claimantPhoneNumber', '1234561234');
    fillData(form, 'input#root_claimantEmailAddress', 'someEmail@email.com');
    // inccorect confirmation email address should fail
    fillData(form, 'input#root_claimantConfirmEmailAddress', 'derp@email.com');

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(1);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should submit with required fields', () => {
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

    changeDropdown(form, 'select#root_claimantAddress_country', 'USA');
    fillData(form, 'input#root_claimantAddress_street', 'Sunny Road');
    fillData(form, 'input#root_claimantAddress_city', 'Someplace');
    changeDropdown(form, 'select#root_claimantAddress_state', 'DC');
    fillData(form, 'input#root_claimantAddress_postalCode', '12345');
    fillData(form, 'input#root_claimantPhoneNumber', '1234561234');
    fillData(form, 'input#root_claimantEmailAddress', 'someEmail@email.com');
    fillData(
      form,
      'input#root_claimantConfirmEmailAddress',
      'someEmail@email.com',
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
