import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { changeDropdown } from 'platform/testing/unit/helpers';
import {
  DefinitionTester,
  fillData,
  selectRadio,
  selectCheckbox,
} from 'platform/testing/unit/schemaform-utils';
import formConfig from '../../config/form';

describe('686 stepchild information', () => {
  const formData = {
    first: 'Adam',
    last: 'Ant',
    ssn: '123456789',
    birthDate: '1982-05-05',
    countryDropdown: 'United States',
    street: '111 somestreet',
    line2: 'NA',
    line3: 'NA',
    city: 'Some City',
    state: 'California',
    postalCode: '12345',
    phoneNumber: '1234567890',
    emailAddress: 'something@place.com',
    'view:selectable686Options': {
      reportStepchildNotInHousehold: true,
    },
    stepChildren: [
      {
        fullName: {
          first: 'Bobby',
          last: 'Joe',
        },
      },
    ],
  };

  const {
    schema,
    uiSchema,
    arrayPath,
    updateFormData,
  } = formConfig.chapters.reportStepchildNotInHousehold.pages.stepchildInformation;

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
        definitions={formConfig.defaultDefinitions}
      />,
    );

    expect(form.find('input').length).to.equal(11);
    expect(form.find('select').length).to.equal(2);
    form.unmount();
  });

  it('should not allow you to proceed without required fields filled', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        pagePerItemIndex={0}
        arrayPath={arrayPath}
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
      />,
    );
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(6);
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should submit with required fields filled', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        pagePerItemIndex={0}
        arrayPath={arrayPath}
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        updateFormData={updateFormData}
      />,
    );
    fillData(form, 'input#root_whoDoesTheStepchildLiveWith_first', 'Bill');
    fillData(form, 'input#root_whoDoesTheStepchildLiveWith_last', 'Bob');
    changeDropdown(form, 'select#root_address_countryName', 'USA');
    fillData(form, 'input#root_address_addressLine1', '112 Some Street');
    fillData(form, 'input#root_address_city', 'The City');
    fillData(form, 'input#root_address_zipCode', '12345');
    changeDropdown(form, 'select#root_address_stateCode', 'AL');

    // test military base toggle restores the previous city/state
    selectCheckbox(form, 'root_address_view:livesOnMilitaryBase', true);
    changeDropdown(form, 'select#root_address_city', 'APO');
    changeDropdown(form, 'select#root_address_stateCode', 'AA');
    selectCheckbox(form, 'root_address_view:livesOnMilitaryBase', false);
    // test end

    selectRadio(form, 'root_supportingStepchild', 'N');
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should display an error if the veteran lists APO, FPO, or DPO as their city', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        pagePerItemIndex={0}
        arrayPath={arrayPath}
        schema={schema}
        uiSchema={uiSchema}
        data={formData}
        onSubmit={onSubmit}
        definitions={formConfig.defaultDefinitions}
        updateFormData={updateFormData}
      />,
    );
    fillData(form, 'input#root_whoDoesTheStepchildLiveWith_first', 'Bill');
    fillData(form, 'input#root_whoDoesTheStepchildLiveWith_last', 'Bob');
    changeDropdown(form, 'select#root_address_countryName', 'USA');
    fillData(form, 'input#root_address_addressLine1', '112 Some Street');
    fillData(form, 'input#root_address_city', 'FPO');
    fillData(form, 'input#root_address_zipCode', '12345');
    changeDropdown(form, 'select#root_address_stateCode', 'AL');
    selectRadio(form, 'root_supportingStepchild', 'N');
    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').text()).to.include(
      'For FPO addresses, check the "They receive mail outside of the United States on a U.S. military base" checkbox. If you live on a military base in the United States, enter your city.',
    );
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });
});
