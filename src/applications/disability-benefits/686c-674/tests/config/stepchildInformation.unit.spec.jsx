import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import { changeDropdown } from '../helpers/index.js';
import {
  DefinitionTester,
  fillData,
} from 'platform/testing/unit/schemaform-utils.jsx';
import formConfig from '../../config/form.js';

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
        first: 'Bobby',
        last: 'Joe',
      },
    ],
  };

  const {
    schema,
    uiSchema,
    arrayPath,
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

    expect(form.find('input').length).to.equal(10);
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
    expect(form.find('.usa-input-error').length).to.equal(5);
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
      />,
    );
    fillData(form, 'input#root_whoDoesTheStepchildLiveWith_first', 'Bill');
    fillData(form, 'input#root_whoDoesTheStepchildLiveWith_last', 'Bob');
    fillData(
      form,
      'input#root_stepchildAddress_addressLine1',
      '112 Some Street',
    );
    fillData(form, 'input#root_stepchildAddress_city', 'The City');
    fillData(form, 'input#root_stepchildAddress_zipCode', '12345');
    changeDropdown(form, 'select#root_stepchildAddress_stateCode', 'AL');
    changeDropdown(
      form,
      'select#root_stepchildAddress_countryName',
      'United States',
    );

    form.find('form').simulate('submit');
    expect(form.find('.usa-input-error').length).to.equal(0);
    expect(onSubmit.called).to.be.true;
    form.unmount();
  });
});
