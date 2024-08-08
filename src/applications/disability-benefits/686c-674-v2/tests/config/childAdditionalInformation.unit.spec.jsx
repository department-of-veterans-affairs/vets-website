import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import {
  DefinitionTester,
  fillData,
  selectCheckbox,
} from 'platform/testing/unit/schemaform-utils';
import { changeDropdown } from 'platform/testing/unit/helpers';

import formConfig from '../../config/form';

describe('686 add child - child additional information', () => {
  const {
    schema,
    uiSchema,
    arrayPath,
    updateFormData,
  } = formConfig.chapters.addChild.pages.addChildAdditionalInformation;

  const formData = {
    'view:selectable686Options': {
      addChild: true,
    },
    childrenToAdd: [
      {
        fullName: {
          first: 'Bill',
          last: 'Bob',
        },
        ssn: '370947141',
        birthDate: '1997-04-02',
        childPlaceOfBirth: {
          state: 'California',
        },
        childStatus: {
          stepchild: false,
        },
        doesChildLiveWithYou: false,
      },
    ],
  };

  it('should render', () => {
    const form = mount(
      <DefinitionTester
        pagePerItemIndex={0}
        arrayPath={arrayPath}
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={formData}
      />,
    );
    expect(form.find('input').length).to.equal(11);
    form.unmount();
  });

  it('should not progress without the required fields', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        pagePerItemIndex={0}
        arrayPath={arrayPath}
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

  it('should progress with the required fields filled', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        pagePerItemIndex={0}
        arrayPath={arrayPath}
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={formData}
        onSubmit={onSubmit}
        updateFormData={updateFormData}
      />,
    );
    fillData(
      form,
      'input#root_childAddressInfo_personChildLivesWith_first',
      'Bill',
    );
    fillData(
      form,
      'input#root_childAddressInfo_personChildLivesWith_last',
      'Bob',
    );
    changeDropdown(
      form,
      'select#root_childAddressInfo_address_countryName',
      'USA',
    );
    fillData(
      form,
      'input#root_childAddressInfo_address_addressLine1',
      'Sunny Road',
    );
    fillData(form, 'input#root_childAddressInfo_address_city', 'Someplace');
    changeDropdown(
      form,
      'select#root_childAddressInfo_address_stateCode',
      'DC',
    );

    // test military base toggle restores the previous city/state in an array
    selectCheckbox(
      form,
      'root_childAddressInfo_address_view:livesOnMilitaryBase',
      true,
    );
    changeDropdown(form, 'select#root_childAddressInfo_address_city', 'APO');
    changeDropdown(
      form,
      'select#root_childAddressInfo_address_stateCode',
      'AA',
    );
    selectCheckbox(
      form,
      'root_childAddressInfo_address_view:livesOnMilitaryBase',
      false,
    );
    // test end

    fillData(form, 'input#root_childAddressInfo_address_zipCode', '12345');

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });

  it('should display an error if the veteran lists APO, FPO, or DPO as their city, but does not check the military base checkbox', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        pagePerItemIndex={0}
        arrayPath={arrayPath}
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={formData}
        onSubmit={onSubmit}
        updateFormData={updateFormData}
      />,
    );
    fillData(
      form,
      'input#root_childAddressInfo_personChildLivesWith_first',
      'Bill',
    );
    fillData(
      form,
      'input#root_childAddressInfo_personChildLivesWith_last',
      'Bob',
    );
    selectCheckbox(
      form,
      'root_childAddressInfo_address_view:livesOnMilitaryBase',
      false,
    );
    changeDropdown(
      form,
      'select#root_childAddressInfo_address_countryName',
      'USA',
    );
    fillData(
      form,
      'input#root_childAddressInfo_address_addressLine1',
      'Sunny Road',
    );
    fillData(form, 'input#root_childAddressInfo_address_city', 'DPO');
    changeDropdown(
      form,
      'select#root_childAddressInfo_address_stateCode',
      'DC',
    );
    fillData(form, 'input#root_childAddressInfo_address_zipCode', '12345');

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').text()).to.include(
      'For DPO addresses, check the "They receive mail outside of the United States on a U.S. military base" checkbox. If you live on a military base in the United States, enter your city.',
    );
    expect(onSubmit.called).to.be.false;
    form.unmount();
  });

  it('should not display an error if the veteran lists APO, FPO, or DPO as their city and checks the military base checkbox', () => {
    const onSubmit = sinon.spy();
    const form = mount(
      <DefinitionTester
        pagePerItemIndex={0}
        arrayPath={arrayPath}
        schema={schema}
        uiSchema={uiSchema}
        definitions={formConfig.defaultDefinitions}
        data={formData}
        onSubmit={onSubmit}
        updateFormData={updateFormData}
      />,
    );
    fillData(
      form,
      'input#root_childAddressInfo_personChildLivesWith_first',
      'Bill',
    );
    fillData(
      form,
      'input#root_childAddressInfo_personChildLivesWith_last',
      'Bob',
    );
    selectCheckbox(
      form,
      'root_childAddressInfo_address_view:livesOnMilitaryBase',
      true,
    );
    changeDropdown(
      form,
      'select#root_childAddressInfo_address_countryName',
      'USA',
    );
    fillData(
      form,
      'input#root_childAddressInfo_address_addressLine1',
      'Sunny Road',
    );
    changeDropdown(form, 'select#root_childAddressInfo_address_city', 'DPO');
    changeDropdown(
      form,
      'select#root_childAddressInfo_address_stateCode',
      'AP',
    );
    fillData(form, 'input#root_childAddressInfo_address_zipCode', '96230');

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
